const redisConnection = require("../lib/redisMSQ/redis-connection");
const nrpSender = require("../lib/redisMSQ/nrp-sender-shim");
var twitter_user_list = require("../config/twitter");

let exportedMethods = {
    async getTweet(){
        //get tweet configuration and send Message to workers
        for(var i in twitter_user_list){
            try {
                let response = await nrpSender.sendMessage({
                    redis: redisConnection,
                    eventName: "get-tweets",
                    data: {
                        //message: req.params.id
                        "nickname": twitter_user_list[i]
                    }
                });
                console.log(response);
            } catch (e) {
                console.log(e);
            }
        }
        
    }
}

module.exports = exportedMethods;