var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
const translate = require('google-translate-api');
const SinaWeibo = require('node-sina-weibo');

// var trans =  translate("hello world", {from:'en', to: 'zh-CN'}).then((re)=>{console.log(re);})
// .catch((err)=>{console.log(err);});

// var oauth2 = new OAuth2('CeOUPLRJuzAPDw53i3omq4SCG', 'rv9BJQ4hHd0f3ZbFzXKMmbW8UBgAfxCqk1stg8bvCcxn8VX6XZ', 'https://api.twitter.com/', null, 'oauth2/token', null);
// oauth2.getOAuthAccessToken('', {
//     'grant_type': 'client_credentials'
// }, function (e, access_token) {
//     console.log(access_token); //string that we can use to authenticate request

//     var options = {
//         hostname: 'api.twitter.com',
//         path: '/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump',
//         headers: {
//             Authorization: 'Bearer ' + access_token
//         }
//     };


//     https.get(options, function (result) {
//         var buffer = '';
//         result.setEncoding('utf8');
//         result.on('data', function (data) {
//             buffer += data;
//         });
//         result.on('end',async function () {
//             var tweets = JSON.parse(buffer);
//             //console.log(tweets); // the tweets!
//             console.log(tweets[0].text);
//             var res = await googleTranslate(tweets[0].text);
//             console.log(res);
//             // for(var i=0;i<tweets.length;i++){
//             //     //var res = await googleTranslate(tweets[i].text);
//             //     console.log(tweets[i].text);
//             //     //console.log(res.text);
//             // }
//         });
//     });
// });


// async function googleTranslate(sentence){
//     trans =  await translate(sentence, {to: 'zh-CN'});
//     return trans;
// }


// var OAuth2 = require('weibo-oauth2');
// var options = {
//   "key": "2071404283",
//   "secret": "cdf13696b698ef6751ad2452c3deb887",
//   "base_uri": "https://api.weibo.com/",
//   "redirect_uri": "http://127.0.0.1:3000/callback",
//   "authorize_path": "/oauth2/authorize",
//   "access_path": "/oauth2/access_token"
// };
// var oauth2 = new OAuth2(options);

// var express = require('express')
// const app = express();

// app.get('/', function(req, res) {
//   var authorizeUrl = oauth2.getAuthorizeUrl();
//   res.redirect(authorizeUrl);
// });

// app.get('/callback', function(req, res) {
//   var code = req.query.code;
//   oauth2.getAccessToken(code, function(err, ret) {
//       console.log(req.session);
//       var session = require('express-session')

//         // session.maxAge = ret.expires_in * 1000;
//         // session.access_token = ret.access_token;

//         var weibo = new SinaWeibo('2071404283', 'cdf13696b698ef6751ad2452c3deb887', ret.access_token);
//         weibo.UPLOAD('statuses/upload',
//             { status:'test!!' }, { pic:'/Applications/XAMPP/xamppfiles/share/doc/libxml2-2.8.0/html/tutorial/images/callouts/1.png' }, function (err, resultInJson, response) {
//                 if (err) return callback(err);
//                 // do something with resultInJson
//             }
//         );
//   });
// });


// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log("Your routes will be running on http://localhost:3000");
// });

const data = require("./data");
const task = data.task;

task.getAllTask().then((re)=>{console.log(re);})
