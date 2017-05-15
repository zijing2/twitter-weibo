const tweetCron = require("./getTweet");
const weiboCron = require("./postWeibo");
const slackCron = require("./postSlack");
var cronJob = require("cron").CronJob; 

// new cronJob('30 * * * * *', function () {  
//     tweetCron.getTweet();
//         //your job code here  
// }, null, true, 'America/New_York'); 

// new cronJob('30 * * * * *', function () {  
//     weiboCron.postWeibo();
//         //your job code here  
// }, null, true, 'America/New_York');

//tweetCron.getTweet();

//weiboCron.postWeibo();
slackCron.postSlack();
