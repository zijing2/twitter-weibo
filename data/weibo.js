const mongoCollections = require("../config/mongoCollections");

const weibo = mongoCollections.weibo;

let exportedMethods = {
    getAllAuth(){
        return weibo().then((weiboCollection) => {
             return weiboCollection.find({}).toArray();
         }).catch((err)=>{console.log(err)});;
    },
    getAuthByweiboid(weiboid){
        return weibo().then((weiboCollection) => {
            //console.log(taskCollection.find({}));
             return weiboCollection.find({"uid": weiboid}).toArray();
         }).catch((err)=>{console.log(err)});;
    },
    insertWeiboAuth(auth){
        return weibo().then((weiboCollection) => {
            var newAuth = auth;
            return weibo().then((weiboCollection) => {
                return weiboCollection.insertOne(newAuth)
                .then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                })
                .then((newId) => {
                    //console.log(newId);
                    //return this.getOrderByOid(newId);
                });  
            });
         }).catch((err)=>{console.log(err)});;
    },
    updateWeiboAuth(){
        
    }
}

module.exports = exportedMethods;  