var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
//const translate = require('google-translate-api');
const SinaWeibo = require('node-sina-weibo');
var oauth_config = require('../config/oauth');
const data = require("../data");
const task = data.task;
const weibo = data.weibo;
const log = data.log;
var twitter_weibo_bind = require('../config/tweiber');
const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");


//post weibo task
redisConnection.on('post-weibo-api:request:*',async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;
    let successEvent = `${eventName}:success:${requestId}`;
    await postWeibo(message.data.access_token,message.data.text);
    await task.deleteTask(message.data.ori_tweet.id_str, message.data.task_id);
    await log.insertLog(message.data.ori_tweet,message.data.weibo_userid,message.data.twitter_username, "success");

    var data = {
        message : "OK",
    }

    redisConnection.emit(successEvent, {
        requestId: requestId,
        data:data,
        eventName: eventName
    });

});

async function postWeibo(access_token, text){
     var weibo = await new SinaWeibo('2071404283', 'cdf13696b698ef6751ad2452c3deb887', access_token);
            // weibo.UPLOAD('statuses/upload',
            await weibo.POST('statuses/update',
                //{ status: text }, { pic:'/Applications/XAMPP/xamppfiles/share/doc/libxml2-2.8.0/html/tutorial/images/callouts/1.png' }, function (err, resultInJson, response) {
                { status: text }, async function (err, resultInJson, response) {
                    console.log("resultInJson");
                    console.log(resultInJson);
                    if (err){
                        console.log("resultInJson");
                        console.log(resultInJson);
                        console.log(err);
                    } 
                    return await resultInJson;
                    // do something with resultInJson
                }
    );
}