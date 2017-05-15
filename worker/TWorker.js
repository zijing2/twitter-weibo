var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
//const translate = require('google-translate-api');
const SinaWeibo = require('node-sina-weibo');
var oauth_config = require('../config/oauth');
const data = require("../data");
const task = data.task;
const slackTask = data.slackTask;
const log = data.log;
const slackLog = data.slackLog;
const weibo = data.weibo;
var twitter_weibo_bind = require('../config/tweiber');
const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");
const translate = require('translate-api');


//var request = require('sync-request');
//const queryString = require('query-string');

//get tweet task
redisConnection.on('get-tweets:request:*',async (message, channel) => {

    let requestId = message.requestId;
    let eventName = message.eventName;

    // let nameText = message.data.name;
    // let keyText = message.data.key;
    let messageText = message.data.nickname;
    let successEvent = `${eventName}:success:${requestId}`;

    var oauth2 = new OAuth2(oauth_config.twitter.APIKey, oauth_config.twitter.APISecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
    oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
    }, function (e, access_token) {
        //console.log(access_token); //string that we can use to authenticate request

        var options = {
            hostname: 'api.twitter.com',
            //path: '/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump',
            path: '/1.1/statuses/user_timeline.json?screen_name='+message.data.nickname,
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        };

        https.get(options,async function (result) {
            var buffer = '';
            result.setEncoding('utf8');
            result.on('data',function (data) {
                buffer += data;
            });
            result.on('end',async function () {
                var tweets = JSON.parse(buffer);
                //console.log(tweets); // the tweets!
                // for(var i=0;i<tweets.length;i++){
                //     //console.log(message.data.nickname+":"+tweets[i].text);
                // }
                var incre_tweets = await chooseIncrementTwitter(tweets,messageText);
                for(var i in incre_tweets){
                    let transText = incre_tweets[i].text;
                    var t =  await translate.getText(transText,{to: 'zh-CN'}).then(async function(text){
                             return await text;
                        }).catch((err)=>{console.log(err);});
                    incre_tweets[i]['translate'] = t.text;
                }
                await task.insertTask(message.data.nickname, twitter_weibo_bind[message.data.nickname], incre_tweets).then((re)=>{})

                //slack task
                incre_tweets = await chooseIncrementTwitterSlack(tweets,messageText);
                for(var i in incre_tweets){
                    let transText = incre_tweets[i].text;
                    var t =  await translate.getText(transText,{to: 'zh-CN'}).then(async function(text){
                             return await text;
                        }).catch((err)=>{console.log(err);});
                    incre_tweets[i]['translate'] = t.text;
                }
                await slackTask.insertTask(message.data.nickname, twitter_weibo_bind[message.data.nickname], incre_tweets).then((re)=>{})



                var data = {
                    message : messageText,
                }
                redisConnection.emit(successEvent, {
                    requestId: requestId,
                    data:data,
                    eventName: eventName
                });
                // for(var i=0;i<tweets.length;i++){
                //     var res = await googleTranslate(tweets[i].text);
                //     console.log(tweets[i].text);
                //     console.log(res.text);
                // }
            });
        });
    });

    // async function googleTranslate(sentence){
    //     trans =  await translate(sentence, {to: 'zh-CN'});
    //     return trans;
    // }

    
});

//fetch the last tweet in task table(if task table is empty, then go to log table),
//compare this tweet to tweets we get one by one, 
//until 1.find a tweet with the same id or 2.no more tweet to compare
//the tweets we just compare are the increment, similar to merge sort
async function chooseIncrementTwitter(tweets,nickname){
    var increment_arr = [];
    return await task.getLastTweetByUser(nickname).then(async (result1)=>{
        if(result1==null){
          return await log.getLastTweetByUser(nickname).then(async (result2)=>{
                if(result2==null){
                    return tweets;
                }else{
                    var last_tweet_id = result2.ori_tweet.id_str;
                    for(var i in tweets){
                        if(last_tweet_id != tweets[i].id_str){
                            increment_arr.push(tweets[i]);
                        }else{
                            return increment_arr;
                        }
                    }
                }
            });
        }else{
            if(result1.ori_tweet[0]==undefined){
                return await log.getLastTweetByUser(nickname).then(async (result2)=>{
                    if(result2==null){
                        return tweets;
                    }else{
                        var last_tweet_id = result2.ori_tweet.id_str;
                        for(var i in tweets){
                            if(last_tweet_id != tweets[i].id_str){
                                increment_arr.push(tweets[i]);
                            }else{
                                return increment_arr;
                            }
                        }
                    }
                });
            }else{
                var last_tweet_id = result1.ori_tweet[0].id_str;
                for(var i in tweets){
                    if(last_tweet_id != tweets[i].id_str){
                        increment_arr.push(tweets[i]);
                    }else{
                        break;
                    }
                }
                return increment_arr;
            }
        }

    });

}


async function chooseIncrementTwitterSlack(tweets,nickname){
    var increment_arr = [];
    return await slackTask.getLastTweetByUser(nickname).then(async (result1)=>{
        if(result1==null){
          return await slackLog.getLastTweetByUser(nickname).then(async (result2)=>{
                if(result2==null){
                    return tweets;
                }else{
                    var last_tweet_id = result2.ori_tweet.id_str;
                    for(var i in tweets){
                        if(last_tweet_id != tweets[i].id_str){
                            increment_arr.push(tweets[i]);
                        }else{
                            return increment_arr;
                        }
                    }
                }
            });
        }else{
            if(result1.ori_tweet[0]==undefined){
                return await slackLog.getLastTweetByUser(nickname).then(async (result2)=>{
                    if(result2==null){
                        return tweets;
                    }else{
                        var last_tweet_id = result2.ori_tweet.id_str;
                        for(var i in tweets){
                            if(last_tweet_id != tweets[i].id_str){
                                increment_arr.push(tweets[i]);
                            }else{
                                return increment_arr;
                            }
                        }
                    }
                });
            }else{
                var last_tweet_id = result1.ori_tweet[0].id_str;
                for(var i in tweets){
                    if(last_tweet_id != tweets[i].id_str){
                        increment_arr.push(tweets[i]);
                    }else{
                        break;
                    }
                }
                return increment_arr;
            }
        }

    });

}

// //post weibo task
// redisConnection.on('post-weibo:request:*',async (message, channel) => {
//     let requestId = message.requestId;
//     let eventName = message.eventName;

//     // let nameText = message.data.name;
//     // let keyText = message.data.key;
//     //get weiboid
//     let messageText = message.data.message;
//     let successEvent = `${eventName}:success:${requestId}`;
//     var weiboid = message.data.weiboid;

//     var tasks = await task.getTaskByWeiboId(weiboid);
//     var auth = await weibo.getAuthByweiboid(weiboid);
//     //console.log(tasks);

//     for(var i in tasks[0].standBy){
//         //await postWeibo(auth[0].access_token, tasks[0].standBy[i].text);
//         //await postWeibo("2.00AHTjwBVs5LQCf805b7024fXNDMwC", tasks[0].standBy[i].text);
//         try {
//                 let response = await nrpSender.sendMessage({
//                     redis: redisConnection,
//                     eventName: "post-weibo-api",
//                     data: {
//                         //message: req.params.id
//                         "access_token" : "2.00AHTjwBVs5LQCf805b7024fXNDMwC",
//                         "text": tasks[0].standBy[i].text,
//                     }
//                 });
//                 console.log(response);
//             } catch (e) {
//                 console.log(e,123123);
//             }
//         //10 sec
//         pause(20000);
//         if(i==1){
//             break;
//         }
//     }
    
//     var data = {
//         message : messageText,
//     }
   
//     redisConnection.emit(successEvent, {
//         requestId: requestId,
//         data:data,
//         eventName: eventName
//     });
// });

// //post weibo task
// redisConnection.on('post-weibo-api:request:*',async (message, channel) => {
//     let requestId = message.requestId;
//     let eventName = message.eventName;
//     let successEvent = `${eventName}:success:${requestId}`;
//     postWeibo(message.data.access_token,message.data.text);

//     var data = {
//         message : "OK",
//     }

//     redisConnection.emit(successEvent, {
//         requestId: requestId,
//         data:data,
//         eventName: eventName
//     });

// });

// function postWeibo(access_token, text){
//      var weibo = new SinaWeibo('2071404283', 'cdf13696b698ef6751ad2452c3deb887', access_token);
//             // weibo.UPLOAD('statuses/upload',
//             weibo.POST('statuses/update',
//                 //{ status: text }, { pic:'/Applications/XAMPP/xamppfiles/share/doc/libxml2-2.8.0/html/tutorial/images/callouts/1.png' }, function (err, resultInJson, response) {
//                 { status: text },  function (err, resultInJson, response) {
//                     console.log(resultInJson);
//                     if (err){
//                         console.log(resultInJson);
//                         console.log(err);
//                     } 
//                     // do something with resultInJson
//                 }
//     );
// }

// function pause(milliseconds) {
// 	var dt = new Date();
// 	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
// }
