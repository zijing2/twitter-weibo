var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
//const translate = require('google-translate-api');
const SinaWeibo = require('node-sina-weibo');
var oauth_config = require('../config/oauth');
const data = require("../data");
const task = data.task;
var twitter_weibo_bind = require('../config/tweiber');

const redisConnection = require("../lib/redisMSQ/redis-connection");
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

//post weibo task
redisConnection.on('post-weibo:request:*',async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    // let nameText = message.data.name;
    // let keyText = message.data.key;
    let messageText = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;

    console.log(message.data);
    

    var data = {
        message : messageText,
    }
   
    redisConnection.emit(successEvent, {
        requestId: requestId,
        data:data,
        eventName: eventName
    });
});