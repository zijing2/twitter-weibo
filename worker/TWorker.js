var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
//const translate = require('google-translate-api');
const SinaWeibo = require('node-sina-weibo');
var oauth_config = require('../config/oauth');
const data = require("../data");
const task = data.task;
const weibo = data.weibo;
var twitter_weibo_bind = require('../config/tweiber');
const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");


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

        https.get(options, function (result) {
            var buffer = '';
            result.setEncoding('utf8');
            result.on('data',function (data) {
                buffer += data;
            });
            result.on('end', function () {
                var tweets = JSON.parse(buffer);
                console.log(tweets); // the tweets!
                // for(var i=0;i<tweets.length;i++){
                //     //console.log(message.data.nickname+":"+tweets[i].text);
                // }
                
                task.insertTask(message.data.nickname, twitter_weibo_bind[message.data.nickname], tweets).then((re)=>{console.log(re);})
                //console.log(message.data);
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