const express = require('express');
const router = express.Router();
var passport = require('passport');
const data = require("../data");
const task = data.task;
const weiboAuth = data.weibo;
const log = data.log;
const tweiber_bind = require("../config/tweiber");

const weiboCron = require("../cron/postWeibo.js");

router.get("/login", (req, res) => {
        var flash = req.flash();
        var error = flash.error;
        var data = {
                "error": error,
                "layout": ""
        };
        res.render('adminlogin', data);
});

router.post("/login", passport.authenticate('localadmin', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
}));

router.all('/*', isLoggedIn);

router.get("/deTask/:Taskid/:Tid", (req, res) => {
        let task_id = req.params.Taskid;
        let tweet_id = req.params.Tid;
        console.log("task id");
        console.log(task_id);
        return task.deleteTask(tweet_id,task_id).then((deleteRes) => {
                res.redirect('/');
        });

});

router.get("/pushSingleTask/:tasknum/:tweetnum", async(req, res) => {
        let tasknum = req.params.tasknum;
        let tweetnum = req.params.tweetnum;
        return await task.getAllTask().then(async(task_list) =>{
                let wid = task_list[tasknum].weibo_userid;
                let text = task_list[tasknum].ori_tweet[tweetnum].text;
                let twitter_username = task_list[tasknum].twitter_username;
                let weibo_userid = task_list[tasknum].weibo_userid;
                return await weiboCron.postSingleWeibo(wid, task_list[tasknum].standBy[tweetnum], task_list[tasknum]._id.toString(),task_list[tasknum].twitter_username, task_list[tasknum].weibo_userid)
                .then(async(result)=>{
                        return await res.redirect("/");
                });
        }).catch((e) =>{
                console.log(e);

        });
                
})


router.get("/", (req, res) => {
        return task.getAllTask().then((task) => {
                var task_list = [];
                for(var i in task){
                        for(var j in task[i].ori_tweet){
                                task_list.push({
                                        "task_id" : task[i]._id,
                                        "tweet_id" : task[i].ori_tweet[j].id_str,
                                        "twitter_username" : task[i].twitter_username,
                                        "weibo_userid" : task[i].weibo_userid,
                                        "ori_tweet" : task[i].ori_tweet[j].text,
                                        "ori_create_at" : task[i].ori_tweet[j].created_at,
                                        "tweet_text" : task[i].ori_tweet[j].text,
                                        "translate" : task[i].ori_tweet[j].translate,
                                        "standBy" : task[i].standBy[j].text,
                                        "task_num":i,
                                        "tweet_num":j
                                });
                        }
                }
                //console.log(task_list[0]);
                var data = {
                        "layout": "",
                        "task": task_list,
                        "is_task": 1
                };
                res.render('admin', data);

        });
});

router.get("/task", (req, res) => {
        return task.getAllTask().then((task) => {
                var task_list = [];
                var z = 0;
                for(var i in task){
                        for(var j in task[i].ori_tweet){
                                task_list.push({
                                        "task_id" : task[i]._id,
                                        "tweet_id" : task[i].ori_tweet[j]._id,
                                        "twitter_username" : task[i].twitter_username,
                                        "weibo_userid" : task[i].weibo_userid,
                                        "ori_tweet" : task[i].ori_tweet[j].text,
                                        "ori_create_at" : task[i].ori_tweet[j].created_at,
                                        "tweet_text" : task[i].ori_tweet[j].text,
                                        "translate" : task[i].ori_tweet[j].translate,
                                        "standBy" : task[i].standBy[j].text,
                                        "task_num":i,
                                        "tweet_num":j
                                });
                        }
                }
                //console.log(task_list[0]);
                var data = {
                        "layout": "",
                        "task": task_list,
                        "is_task": 1
                };
                res.render('admin', data);

        });
});

router.get("/robot", (req, res) => {
        return weiboAuth.getAllAuth().then((allWeiboAtuh) => {
                for(var i in allWeiboAtuh){
                        for(var j in tweiber_bind){
                                if(tweiber_bind[j]==allWeiboAtuh[i].uid){
                                        allWeiboAtuh[i]["twitter_name"] = j;
                                }
                        }
                        
                }
                var data = {
                        "layout": "",
                        "weiboAuth": allWeiboAtuh,
                        "is_user": 1
                };
                res.render('admin', data);
        });
});

router.get("/log", (req, res) => {
        return log.getAllLog().then((log) => {
                //console.log(log);
                var log_list = [];
                for(var i in log){
                        
                        log_list.push({
                                "log_id" : log[i]._id,
                                "tweet_id" : log[i].ori_tweet.id_str,
                                "twitter_username" : log[i].twitter_username,
                                "weibo_userid" : log[i].weibo_userid,
                                "ori_tweet" : log[i].ori_tweet.text,
                                "ori_create_at" : log[i].ori_tweet.created_at,
                                "standBy" : log[i].standBy.text,
                                "translate" : log[i].standBy.translate,
                                "status" : log[i].status
                        });
                        
                }
                var data = {
                        "layout": "",
                        "log": log_list,
                        "is_log": 1
                };
                res.render('admin', data);
        });
});

router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/admin/login');
});

function isLoggedIn(req, res, next) {
        //console.log(req.isAuthenticated());
        //console.log(req.user);
        if (req.isAuthenticated() && req.user.adminname) {
                return next()
        }
        res.redirect('/admin/login');
}

module.exports = router;