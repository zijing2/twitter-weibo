const tweetCron = require("./getTweet");
var cronJob = require("cron").CronJob; 

// new cronJob('* * * * * *', function () {  
//     tweetCron.getTweet();
//         //your job code here  
// }, null, true, 'America/New_York'); 

tweetCron.getTweet();