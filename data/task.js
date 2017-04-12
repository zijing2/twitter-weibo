const mongoCollections = require("../config/mongoCollections");

const task = mongoCollections.task;

let exportedMethods = {
    getAllTask(){
        return task().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({}).toArray();
         }).catch((err)=>{console.log(err)});;
    },
    getTaskByWeiboId(weiboid){
        return task().then((taskCollection) => {
            //console.log(taskCollection.find({}));
             return taskCollection.find({"weibo_userid": weiboid}).toArray();
         }).catch((err)=>{console.log(err)});;
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
    }
}

module.exports = exportedMethods;    