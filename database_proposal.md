#Database proposal

#Tweiber
- Zijing Huang
- ShiZhe Zhou
- RunXi Ding

##Task
task collection is used to store the tweets which are ready to send.

```
{
    "_id":"7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "twitter_username" : "realDonaldTrump",
    "weibo_userid": "6208380260",
    "ori_tweet": [{ 
    	"id" : "851894518014238700",
    	"text" : "Great Strategic &amp; Policy CEO Forum today with my Cabinet Secretaries and top CEO\'s from around the United States.… https://t.co/pmGIL08OpP",
    	"create_at": "Tue Apr 11 20:27:35 +0000 2017"
    	},{
    	"id":...
    	"text":...
    	"create_at":...
    	}
    ],
    "standBy": [{ 
    	"id" : "851894518014238700",
    	"text" : "Great Strategic &amp; Policy CEO Forum today with my Cabinet Secretaries and top CEO\'s from around the United States.… https://t.co/pmGIL08OpP",
    	"create_at": "Tue Apr 11 20:27:35 +0000 2017"
    	},{
    	"id":...
    	"text":...
    	"create_at":...
    	}
    ]
}	
```

| Name        | Type           | Description  |
| ----------- | -------------- | ------------ |
| _id  | string | identify specific task|
| twitter_username | string | this tweet creat by who |
| weibo_userid | string |use this weibo account to send tweet |
| id | string | tweet id use to filter the overlap tweet |
| text | string | tweet content |
| create_at | string | tweet creat at |


##Log
Log collection is used to record the information about the status of tasks.

```
{
    "_id":"7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    "twitter_username" : "realDonaldTrump",
    "weibo_userid": "6208380260",
    "ori_tweet": [{ 
    	"id" : "851894518014238700",
    	"text" : "Great Strategic &amp; Policy CEO Forum today with my Cabinet Secretaries and top CEO\'s from around the United States.… https://t.co/pmGIL08OpP",
    	"create_at": "Tue Apr 11 20:27:35 +0000 2017"
    	},{
    	"id":...
    	"text":...
    	"create_at":...
    	}
    ],
    "standBy": [{ 
    	"id" : "851894518014238700",
    	"text" : "Great Strategic &amp; Policy CEO Forum today with my Cabinet Secretaries and top CEO\'s from around the United States.… https://t.co/pmGIL08OpP",
    	"create_at": "Tue Apr 11 20:27:35 +0000 2017"
    	},{
    	"id":...
    	"text":...
    	"create_at":...
    	}
    ],
    "stime": "Tue Apr 11 20:27:35 +0000 2017",
    "status": "success"
}	
```

| Name        | Type           | Description  |
| ----------- | -------------- | ------------ |
| _id  | string | identify specific task|
| twitter_username | string | this tweet creat by who |
| weibo_userid | string |use this weibo account to send tweet |
| id | string | tweet id use to filter the overlap tweet |
| text | string | tweet content |
| create_at | string | tweet creat at |
| stime | string | when do we exec the task |
| status | string | success or fail |


##WeiboAuth
Store weibo access_token which is used to send weibo

```
{
    "_id" : ObjectId("58ee81e8bbb3bea68b8ee18e"),
    "access_token" : "2.00AHTjwBVs5LQCf805b7024fXNDMwC",
    "remind_in" : "157679999",
    "expires_in" : 157679999,
    "uid" : "1783996990"
}	
```
| Name        | Type           | Description  |
| ----------- | -------------- | ------------ |
| _id  | string | identify specific task|
| access_token | string | access_token for weibo user |
| expires_in | string |use this time to refresh token |
| uid | string | weibo user id |


