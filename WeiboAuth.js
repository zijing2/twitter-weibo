//Weibo Auth
var OAuth2 = require('OAuth').OAuth2;
const SinaWeibo = require('node-sina-weibo');
const data = require("./data");
const weibo = data.weibo;

var OAuth2 = require('weibo-oauth2');
var options = {
  "key": "2071404283",
  "secret": "cdf13696b698ef6751ad2452c3deb887",
  "base_uri": "https://api.weibo.com/",
  "redirect_uri": "http://127.0.0.1:3000/callback",
  "authorize_path": "/oauth2/authorize",
  "access_path": "/oauth2/access_token"
};
var oauth2 = new OAuth2(options);

var express = require('express');
const app = express();

app.get('/', function(req, res) {
  var authorizeUrl = oauth2.getAuthorizeUrl();
  res.redirect(authorizeUrl);
});

app.get('/callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  oauth2.getAccessToken(code, function(err, ret) {
      console.log(ret);
      //store access_token
      weibo.insertWeiboAuth(ret);

      //var session = require('express-session')

        // session.maxAge = ret.expires_in * 1000;
        // session.access_token = ret.access_token;

        // var weibo = new SinaWeibo('2071404283', 'cdf13696b698ef6751ad2452c3deb887', ret.access_token);
        // weibo.UPLOAD('statuses/upload',
        //     { status:'test!!' }, { pic:'/Applications/XAMPP/xamppfiles/share/doc/libxml2-2.8.0/html/tutorial/images/callouts/1.png' }, function (err, resultInJson, response) {
        //         if (err) return callback(err);
        //         // do something with resultInJson
        //     }
        // );
  });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});