const mongoCollections = require("../config/mongoCollections");

const slackTask = mongoCollections.slackTask;
const log = mongoCollections.log;
var ObjectID = require('mongodb').ObjectID;

let exportedMethods = {
    getAllTask(){
        return slackTask().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({}).toArray();
         }).catch((err)=>{console.log(err)});;
    },
    async deleteTask(tweetid, task_id) {
        return await slackTask().then(async(taskCollection) => {
            var taskid = new ObjectID(task_id)
            return await taskCollection.update({"_id": taskid},{$pull: {"ori_tweet" : {"id_str" : tweetid}}}).then(async(result1)=> {
                console.log(result1.result);
                return await taskCollection.update({"_id": taskid},{$pull: {"standBy" : {"id_str" : tweetid}}});
            }).then(async(result2)=>{
                console.log(result2.result);
            });
        }).catch((err) => {
            console.log(err);
        });
        
    },
    getTeetByTeetId(tweetid) {
        return slackTask().then((taskCollection) => {
            console.log(tweetid);
            return taskCollection.find({"ori_tweet.id_str" : tweetid})
        }).catch((err) => {
            console.log(err);
        })
    },
    getTaskByWeiboId(weiboid){
        return slackTask().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({"weibo_userid": weiboid}).toArray();
         }).catch((err)=>{console.log(err)});
    },
    async insertTask(twitter_username, weibo_userid, tweets){
    return await this.getLastTweetByUser(twitter_username).then(async (result)=>{
           if(result==null){
                 var newTask = {
                    "twitter_username": twitter_username,
                    "weibo_userid": weibo_userid,
                    "ori_tweet": tweets,
                    "standBy": tweets
                };
                return await slackTask().then(async (taskCollection) => {
                    return await taskCollection.insertOne(newTask)
                    .then( async (newInsertInformation) => {
                        return await newInsertInformation.insertedId;
                    })
                    .then((newId) => {
                        console.log(newId);
                        //return this.getOrderByOid(newId);
                    });  
                });
           }else{
                return await slackTask().then(async (taskCollection) => {
                    await taskCollection.update({"twitter_username" : twitter_username},{$set:{"standBy":tweets.concat(result.ori_tweet)}});
                    return await taskCollection.update({"twitter_username" : twitter_username},{$set:{"ori_tweet":tweets.concat(result.ori_tweet)}});
                })
           }
       });
       
    },
     
    async getLastTweetByUser(nickname){
        return await slackTask().then(async(taskCollection) => {
            return await taskCollection.findOne({"twitter_username" : nickname});
        }).catch((err) => {
            console.log(err);
        })
    }
    
}

module.exports = exportedMethods;    