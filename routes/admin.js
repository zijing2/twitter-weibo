const express = require('express');
const router = express.Router();
var passport = require('passport');
const data = require("../data");
const task = data.task;

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

router.get("/deTask/:Tid", (req, res) => {
        let task_id = req.params.Tid;
        console.log("task id");
        console.log(task_id);
        return task.deleteTask(task_id).then((deleteRes) => {
                res.redirect('/');
        });

});

router.get("/pushSingleTask/:tasknum/:tweetnum", (req, res) => {
        let tasknum = req.params.tasknum;
        let tweetnum = req.params.tweetnum;
        return task.getAllTask().then((task_list) =>{
                let wid = task_list[tasknum].weibo_userid;
                let text = task_list[tasknum].ori_tweet[tweetnum].text;
                let twitter_username = task_list[tasknum].twitter_username;
                let weibo_userid = task_list[tasknum].weibo_userid;
                return weiboCron.postSingleWeibo(wid, text)
                .then((result)=>{
                return task.insertLog(task_list[tasknum].ori_tweet[tweetnum], weibo_userid, twitter_username, "success");
                }).then((postresult) =>{
                let deleteURL = '/admin/deTask/' + task_list[tasknum].ori_tweet[tweetnum].id_str;
                console.log(deleteURL);
                return res.redirect(deleteURL);
                });
        }).catch((e) =>{
                console.log(e);

        });
        // return task.getAllTask().then((task) => {
        //         let wid = task[tasknum].weibo_userid;
        //         let text = task[tasknum].ori_tweet[tweetnum].text;
        //         weiboCron.postSingleWeibo(wid, text).then((result) => {
        //                 console.log(result);
        //                 return task.insertLog(task[tasknum].ori_tweet[tweetnum],"success").then((result) => {
        //                         let deleteURL = "/deTask/" + task[tasknum].weibo_userid;
        //                         res.redirect(deleteURL);
        //                 });
                
        //         }).catch((e) => {
        //                 console.log(result);  
        //                 return task.insertLog(task[tasknum].ori_tweet[tweetnum],"fail");
        //         });

        // });
                
})



router.get("/", (req, res) => {
        return task.getAllTask().then((task) => {
                var task_list = [];
                var z = 0;
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
                                        "standBy" : task[i].standBy[j].text
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



// router.post("/newproduct", (req, res) => {
//         var type = req.body.type;
//         var name = req.body.name;
//         var img = req.body.img;
//         console.log(req.body);
//         product.addProduct(type, name, img).then((productinfo) => {
//                 res.redirect(req.get('referer'));
//         }).catch((err) => {
//                 req.flash('err', err);
//                 res.redirect('/admin/product');
//         });

// });

// router.get("/user", (req, res) => {
//         return user.getAllUsers().then((users) => {
//                 var data = {
//                         "layout": "",
//                         "users": users,
//                         "is_user": 1
//                 };
//                 res.render('admin', data);

//         });
// });

// router.get("/order", (req, res) => {
//         return order.getAllOrders().then((orders) => {
//                 var data = {
//                         "layout": "",
//                         "orders": orders,
//                         "is_order": 1
//                 };
//                 console.log(orders);
//                 res.render('admin', data);

//         });
// });

// router.get("/pet", (req, res) => {
//         return user.getAllPets().then((pets) => {
//                 var data = {
//                         "layout": "",
//                         "pets": pets,
//                         "is_pet": 1
//                 };
//                 console.log(pets);
//                 res.render('admin', data);

//         });
// });

// router.get("/product", (req, res) => { 
//         return product.getAllProducts().then((products)=>{
//                 console.log("11111111111111");
//                 console.log(products);
//                 var data = {
//                 "layout":"",
//                 "products":products,
//                 "is_product":1
//                 };
//                 res.render('admin',data);

//         });        
// });

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