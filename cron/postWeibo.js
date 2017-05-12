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
    async postSingleWeibo(userId, text){
         try {
                let response = await nrpSender.sendMessage({
                    redis: redisConnection,
                    eventName: "post-single-weibo",
                    data: {
                        //message: req.params.id
                        "weiboid": userId,
                        "text": text
                    }
                });
                console.log("post response");
                console.log(response);
            } catch (e) {
                console.log(e);
            }
        } 

}

module.exports = exportedMethods;