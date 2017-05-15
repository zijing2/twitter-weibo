# Tweiber

Tweiber is a factory that have thousands of robots to sychonize messages between different social media.

## Tweiber deploy

1. download the source code
2. npm install
3. start your mongodb and redis
4. create collection as writeup say
5. register a weibo account and a twitter account
6. create a slack group(optional)
7. bind your accounts in config directory
8. run workers in worker directory respectively

## Tweiber entrypoint

./app.js (for the admin interface: http://localhost:3001)
./WeiboAuth.js (for the authorization of Weibo: http://localhost:3000)
./worker (for running the worker)

## PS

more deploy detail and screenshot are in the writeup file 

