var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
const translate = require('google-translate-api');

var oauth2 = new OAuth2('CeOUPLRJuzAPDw53i3omq4SCG', 'rv9BJQ4hHd0f3ZbFzXKMmbW8UBgAfxCqk1stg8bvCcxn8VX6XZ', 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    console.log(access_token); //string that we can use to authenticate request

    var options = {
        hostname: 'api.twitter.com',
        path: '/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };


    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end',async function () {
            var tweets = JSON.parse(buffer);
            //console.log(tweets); // the tweets!
            for(var i=0;i<tweets.length;i++){
                var res = await googleTranslate(tweets[i].text);
                console.log(tweets[i].text);
                console.log(res.text);
            }
        });
    });
});



async function googleTranslate(sentence){
    trans =  await translate(sentence, {to: 'zh-CN'});
    return trans;
}

