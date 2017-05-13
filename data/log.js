const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;
const log = mongoCollections.log;
var ObjectID = require('mongodb').ObjectID;

let exportedMethods = {
    getLastTweetByUser(twitter_username){
        return log().then((logCollection) => {
             return logCollection.findOne({"twitter_username" : twitter_username});
         }).catch((err)=>{console.log(err)});
    }
}

module.exports = exportedMethods;   