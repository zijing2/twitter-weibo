var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
const data = require("../data");
const task = data.task;
const slackTask = data.slackTask;
const slackLog = data.slackLog;
var twitter_slack_bind = require('../config/twitterSlack');
const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");
var exec = require('child_process').exec;
var sleep = require('sleep');

//post weibo task
redisConnection.on('post-slack:request:*',async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;
    let successEvent = `${eventName}:success:${requestId}`;



    var weiboid = message.data.weiboid;
    var tasks = await slackTask.getTaskByWeiboId(weiboid);



    for(var i in tasks[0].standBy){
        try {
                //postSlack
                let twitter_username = tasks[0].twitter_username;
                let text = tasks[0].standBy[i].text  + " 翻译：" +  tasks[0].standBy[i].translate;
                let id_str = tasks[0].ori_tweet[i].id_str;
                let task_id = tasks[0]._id;
                await postSlack(twitter_username, text);
                await slackTask.deleteTask(id_str, task_id);
                //message.data.ori_tweet
                await slackLog.insertLog(text, weiboid, twitter_username, "success");
            } catch (e) {
                console.log(e);
            }
        
        sleep.sleep(5);
    }

    var data = {
        message : "OK",
    }

    redisConnection.emit(successEvent, {
        requestId: requestId,
        data:data,
        eventName: eventName
    });

});

async function postSlack(twitter_username, text){
    let url = twitter_slack_bind[twitter_username];
    var cmd = `curl -X POST --data-urlencode 'payload={"channel": "#general", "username": "${twitter_username}", "text": "${text}", "icon_emoji": ":ghost:"}' ${url}`;
    console.log(cmd);
    exec(cmd, function(error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
    });
}
