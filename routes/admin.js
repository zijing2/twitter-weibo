const express = require('express');
const router = express.Router();
var passport = require('passport');
const data = require("../data");
const task = data.task;


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
router.get("/", (req, res) => {
        return task.getAllTask().then((task) => {
                var task_list = [];
                var z = 0;
                for(var i in task){
                        for(var j in task[i].ori_tweet){
                                task_list.push({
                                        "task_id" : task[i]._id,
                                        "twitter_username" : task[i].twitter_username,
                                        "weibo_userid" : task[i].weibo_userid,
                                        "ori_tweet" : task[i].ori_tweet[j].text,
                                        "ori_create_at" : task[i].ori_tweet[j].created_at,
                                        "standBy" : task[i].standBy[j].text
                                });
                        }
                }
                console.log(task_list[0]);
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
                                        "twitter_username" : task[i].twitter_username,
                                        "weibo_userid" : task[i].weibo_userid,
                                        "ori_tweet" : task[i].ori_tweet[j].text,
                                        "ori_create_at" : task[i].ori_tweet[j].created_at,
                                        "standBy" : task[i].standBy[j].text
                                });
                        }
                }
                console.log(task_list[0]);
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