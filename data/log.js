const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;
const log = mongoCollections.log;
var ObjectID = require('mongodb').ObjectID;

let exportedMethods = {
    async getLastTweetByUser(twitter_username){
        return await log().then(async(logCollection) => {
             return await logCollection.findOne({"twitter_username" : twitter_username});
         }).catch((err)=>{console.log(err)});
    },
    getAllLog(){
        return log().then((logCollection) => {
             return logCollection.find({}).toArray();
         }).catch((err)=>{console.log(err)});
    },
    async insertLog(tweets, weibo_userid, twitter_username, status) {
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
        return await log().then(async(logCollection) => {
            return await logCollection.insertOne(newLog)
            .then(async(newInsertInformation) => {
                return await newInsertInformation.insertedId;
            }).then(async(newId) => {
                console.log(newId);
            });
        });
    },   
}

module.exports = exportedMethods;   