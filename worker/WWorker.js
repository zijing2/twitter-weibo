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

//post weibo task
redisConnection.on('post-weibo:request:*',async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    // let nameText = message.data.name;
    // let keyText = message.data.key;
    //get weiboid
    let messageText = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;
    var weiboid = message.data.weiboid;

    var tasks = await task.getTaskByWeiboId(weiboid);
    var auth = await weibo.getAuthByweiboid(weiboid);
    //console.log(tasks);

    for(var i in tasks[0].standBy){
        //await postWeibo(auth[0].access_token, tasks[0].standBy[i].text);
        //await postWeibo("2.00AHTjwBVs5LQCf805b7024fXNDMwC", tasks[0].standBy[i].text);
        try {
                let response = await nrpSender.sendMessage({
                    redis: redisConnection,
                    eventName: "post-weibo-api",
                    data: {
                        //message: req.params.id
                        //"access_token" : "2.00AHTjwBVs5LQCf805b7024fXNDMwC",
                        "access_token" : auth[0].access_token,
                        "text": tasks[0].standBy[i].text,
                    }
                });
                console.log(response);
            } catch (e) {
                console.log(e,123123);
            }
        //10 sec
        pause(20000);
    }
    
    var data = {
        message : messageText,
    }
   
    redisConnection.emit(successEvent, {
        requestId: requestId,
        data:data,
        eventName: eventName
    });
});

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}