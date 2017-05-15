const taskData = require("./task");
const slackTaskData = require("./slackTask");
const weiboData = require("./weibo");
const admin = require("./admin");
const logData = require("./log");
const slackLogData = require("./slackLog");

module.exports = {
    task: taskData,
    slackTask: slackTaskData,
    weibo: weiboData,
    admin: admin,
    log: logData,
    slackLog: slackLogData
};
