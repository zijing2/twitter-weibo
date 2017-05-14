const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");
var weibo_user_list = require("../config/weibo");

let exportedMethods = {
    async postWeibo(){
        //get tweet configuration and send Message to workers
        for(var i in weibo_user_list){
            try {
                let response = await nrpSender.sendMessage({
                    redis: redisConnection,
                    eventName: "post-weibo",
                    data: {
                        //message: req.params.id
                        "weiboid": weibo_user_list[i]
                    }
                });
                console.log(response);
            } catch (e) {
                console.log(e);
            }
        }        
    },
    async postSingleWeibo(userId, tweet, task_id, twitter_username, weibo_userid){
         try {
                let response = await nrpSender.sendMessage({
                    redis: redisConnection,
                    eventName: "post-single-weibo",
                    data: {
                        //message: req.params.id
                        "weiboid": userId,
                        "text": tweet.text +" 翻译：" + tweet.translate,
                        "twitter_username": twitter_username,
                        "weibo_userid": weibo_userid,
                        "ori_tweet": tweet,
                        "standBy": tweet,
                        "task_id": task_id
                    }
                });
            } catch (e) {
                console.log(e);
            }
        } 

}

module.exports = exportedMethods;