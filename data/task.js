const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;
const log = mongoCollections.log;
var ObjectID = require('mongodb').ObjectID;

let exportedMethods = {
    getAllTask(){
        return task().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({}).toArray();
         }).catch((err)=>{console.log(err)});;
    },
    deleteTask(tweetid) {
        return task().then((taskCollection) => {
            console.log("deleting");
            return taskCollection.update({},{$pull: {"ori_tweet" : {"id_str" : tweetid}}}).then((result1)=> {
                console.log(result1.result);
                return taskCollection.update({},{$pull: {"standBy" : {"id_str" : tweetid}}});
            }).then((result2)=>{
                console.log(result2.result);
            });
        }).catch((err) => {
            console.log("err");
        });
        
    },
    getTeetByTeetId(tweetid) {
        return task().then((taskCollection) => {
            console.log(tweetid);
            return taskCollection.find({"ori_tweet.id_str" : tweetid})
        }).catch((err) => {
            console.log(err);
        })
    },
    getTaskByWeiboId(weiboid){
        return task().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({"weibo_userid": weiboid}).toArray();
         }).catch((err)=>{console.log(err)});
    },
    insertTask(twitter_username, weibo_userid, tweets){
        var newTask = {
            "twitter_username": twitter_username,
            "weibo_userid": weibo_userid,
            "ori_tweet": tweets,
            "standBy": tweets
        };
        return task().then((taskCollection) => {
            return taskCollection.insertOne(newTask)
            .then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            })
            .then((newId) => {
                console.log(newId);
                //return this.getOrderByOid(newId);
            });  
        });
    },
    insertLog(tweets, weibo_userid, twitter_username, status) {
        let nowTime = new Date();
        let timeString = nowTime.toString();
        var newLog = {
            "twitter_username": twitter_username,
            "weibo_userid": weibo_userid,
            "ori_tweet": tweets,
            "standBy": tweets,
            "status": status,
            "stime": timeString
        };
        return log().then((logCollection) => {
            return logCollection.insertOne(newLog)
            .then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                console.log(newId);
            });
        });
    }
}

module.exports = exportedMethods;    