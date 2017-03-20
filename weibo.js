var querystring = require('querystring'),  
crypto = require('crypto'),  
https = require('https'),  
URL = require('url'),  
path = require('path'),  
fs = require('fs'),
tls = require('tls');  
  
var apiprefix = 'https://api.weibo.com/2/',  
appkey = '2071404283',  
appsecret = 'cdf13696b698ef6751ad2452c3deb887';  
var userId = "415940392@qq.com",  
passwd = "Us@123456";  
  
var baseurl = "https://api.weibo.com/2/";  
  
var weibo = module.exports = function() {  
    this._accesstoken = "";  
    this._accessTokenName = "access_token";  
};  
weibo.prototype = {  
        //oauth2/authorize  
    getAuthorize: function(callback) {  
        var params = {};  
        params['client_id'] = appkey; // appkey  
        params['redirect_uri'] = "http://127.0.0.1/callback"; // oauth2 回调地址  
        params['response_type'] = "code";  
        params['action'] = "submit";  
        params['userId'] = userId; // 微博帐号  
        params['passwd'] = passwd; // 帐号密码  
        var post_data = querystring.stringify(params);  
        var post_headers = {  
            'Content-Type': 'application/x-www-form-urlencoded'  
        };  
        var url = apiprefix + "oauth2/authorize";  
        //https request  
        var m = "POST";  
        var code = "";  
        var tt = this;  
        this._request(m, url, post_headers, post_data, null,  
        function(error, body, response) {  
            if (error) {  
                console.log("error:" + error);  
            }  
            else {  
                console.log(response.headers);
                //code = response.headers.location.substr(6);  
                code = "4658fc8589ea9138930693535beeb799";  
                tt.getAccesstoken(code,  
                function(err, access_token, refresh_token) {  
                    console.log(access_token);  
                    tt._accesstoken = access_token;  
                    callback(err, access_token, refresh_token);  
                });  
            }  
        });  
    },  
    //oauth2/access_token  
    getAccesstoken: function(code, callback) {  
        var params = {};  
        params['grant_type'] = "authorization_code"; // appkey  
        params['redirect_uri'] = "http://127.0.0.1/callback"; // oauth2 回调地址  
        params['client_id'] = appkey;  
        params['client_secret'] = appsecret;  
        params['code'] = code;  
  
        var post_data = querystring.stringify(params);  
        var post_headers = {  
            'Content-Type': 'application/x-www-form-urlencoded',  
            "contentType":"text/html;charset=uft-8"  
        };  
        var url = apiprefix + "oauth2/access_token";  
        //https request  
        var m = "POST";  
        this._request(m, url, post_headers, post_data, null,  
        function(error, data, response) {  
            if (error) callback(error);  
            else {  
                var results;  
                try {  
                    // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07  
                    // responses should be in JSON  
                    results = JSON.parse(data);  
                }  
                catch(e) {  
                    // .... However both Facebook + Github currently use rev05 of the spec  
                    // and neither seem to specify a content-type correctly in their response headers :(  
                    // clients of these services will suffer a *minor* performance cost of the exception  
                    // being thrown  
                    results = querystring.parse(data);  
                }  
                var access_token = results["access_token"];  
                var refresh_token = results["refresh_token"];  
                delete results["refresh_token"];  
                callback(null, access_token, refresh_token);  
            }  
        });  
    },  
    //通用https request,从node-oauth上oauth2摘出来的  
    _request: function(method, url, headers, post_body, access_token, callback) {  
        //var creds = crypto.createCredentials({}); 
        var creds = tls.createSecureContext({});
        var parsedUrl = URL.parse(url, true);  
        if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;  
  
        var realHeaders = {};  
        if (headers) {  
            for (var key in headers) {  
                realHeaders[key] = headers[key];  
            }  
        }  
        realHeaders['Host'] = parsedUrl.host;  
  
        if (Buffer.isBuffer(post_body)) {  
            realHeaders['Content-Length'] = post_body ? post_body.length: 0;  
        }  
        else {  
            realHeaders['Content-Length'] = post_body ? Buffer.byteLength(post_body) : 0;  
        }  
        if (access_token) {  
            if (!parsedUrl.query) parsedUrl.query = {};  
            parsedUrl.query[this._accessTokenName] = access_token;  
        }  
  
        var result = "";  
        var queryStr = querystring.stringify(parsedUrl.query);  
        if (queryStr) queryStr = "?" + queryStr;  
        var options = {  
            host: parsedUrl.hostname,  
            port: parsedUrl.port,  
            path: parsedUrl.pathname + queryStr,  
            method: method,  
            headers: realHeaders  
        };  
        // Some hosts *cough* google appear to close the connection early / send no content-length header  
        // allow this behaviour.  
        var allowEarlyClose = false;  
        var callbackCalled = false;  
        function passBackControl(response, result) {  
            if (!callbackCalled) {  
                callbackCalled = true;  
                if (response.statusCode != 200 && (response.statusCode != 301) && (response.statusCode != 302)) {  
                    callback({  
                        statusCode: response.statusCode,  
                        data: result  
                    });  
                } else {  
                    callback(null, result, response);  
                }  
            }  
        }  
        console.log("options:");  
        console.log(options);  
        var request = https.request(options,  
        function(response) {  
            response.on("data",  
            function(chunk) {  
                result += chunk  
            });  
            response.on("close",  
            function(err) {  
                if (allowEarlyClose) {  
                    passBackControl(response, result);  
                }  
            });  
            response.addListener("end",  
            function() {  
                passBackControl(response, result);  
            });  
        });  
        request.on('error',  
        function(e) {  
            callbackCalled = true;  
            callback(e);  
        });  
        if (method == 'POST' && post_body) {  
            request.write(post_body);  
        }  
        request.end();  
    },  
    //普通post,执行类似statuses/update.json  
    post: function(url, params, callback) {  
        if (!this._accesstoken) return callback("not authorize");  
        var post_data = querystring.stringify(params);  
        var post_headers = {  
            'Content-Type': 'application/x-www-form-urlencoded'  
        };  
        if (params.ContentType) {  
            post_headers['Content-Type'] = params.ContentType;  
        }  
        this._request("POST", baseurl + url + '.json', post_headers, post_data, this._accesstoken, callback);  
    },  
    
    /********** statuses *********/  
    //statuses/repost 转发一条微博信息  
    //statuses/destroy 删除微博信息  
    //statuses/update 发布一条微博信息  
    //statuses/upload 上传图片并发布一条微博  
    //statuses/upload_url_text 发布一条微博同时指定上传的图片或图片url   
    //emotions 获取官方表情  
    repost: function(args, callback) {  
        /* args参数: 
         *  id : 微博id 
         *  status : 转发文本  
         *  is_comment 0-不发评论 1-发评论给当前微博 2-发评论给原微博 3-都发 
         */  
        if (!args.id) return callback('missing argument id');  
        this.post('statuses/repost', args, callback);  
    },  
  
    update: function(params, callback) {  
        if (!params.status) return callback('missing argument status');  
        this.post('statuses/update', params, callback);  
    },  
  
    FILE_CONTENT_TYPES: {  
        '.gif': 'image/gif',  
        '.jpeg': 'image/jpeg',  
        '.jpg': 'image/jpeg',  
        '.png': 'image/png'  
  
    },  
        //获取文件信息,用于statuses/upload 上传图片并发布一条微博  
    fileinfo: function(file) {  
        var name, content_type;  
        if (typeof(file) === 'string') {  
            var ext = path.extname(file);  
            content_type = this.FILE_CONTENT_TYPES[ext];  
            name = path.basename(file);  
        } else {  
            name = file.name || file.fileName;  
            content_type = file.fileType || file.type;  
        }  
        return {  
            name: name,  
            content_type: content_type  
        };  
    },  
  
    /**  
     * 上传图片 
     * pic: filepath 
     * callback: finish callback function 
     **/  
    upload: function(params, callback) {  
        if (!params.status) return callback('missing argument status');  
        var pic = params.pic;  
        var pic_field = 'pic';  
  
        var boundary = 'boundary' + (new Date).getTime();  
        var dashdash = '--';  
        var crlf = '\r\n';  
  
        /* Build RFC2388 string. */  
        var builder = '';  
  
        builder += dashdash;  
        builder += boundary;  
        builder += crlf;  
                //微博文字  
        builder += 'Content-Disposition: form-data; name="status"';  
        builder += crlf;  
        builder += crlf;  
        /* Append form data. */  
        builder += params.status;  
        builder += crlf;  
  
        /* Write boundary. */  
        builder += dashdash;  
        builder += boundary;  
        builder += crlf;  
  
        var fileinfo = this.fileinfo(pic);  
  
        /* Generate headers. [PIC] */  
        builder += 'Content-Disposition: form-data; name="' + pic_field + '"';  
  
        builder += '; filename="' + fileinfo.name + '"';  
        builder += crlf;  
  
        builder += 'Content-Type: ' + fileinfo.content_type + ';';  
        builder += crlf;  
        builder += crlf;  
  
        var tt = this;  
        // 处理文件内容  
        //微博图片  
        this.read_file(pic,  
        function(file_buffer) {  
            var endstr = crlf + dashdash + boundary + dashdash + crlf,  
            buffer = null;  
            if (typeof(BlobBuilder) === 'undefined') {  
                var builderLength = new Buffer(builder).length;  
                var size = builderLength + file_buffer.length + endstr.length;  
                buffer = new Buffer(size);  
                var offset = 0;  
                buffer.write(builder);  
                offset += builderLength;  
                file_buffer.copy(buffer, offset);  
                offset += file_buffer.length;  
                buffer.write(endstr, offset);  
            } else {  
                buffer = new BlobBuilder(); //NOTE WebKitBlogBuilder  
                buffer.append(builder);  
                buffer.append(pic);  
                buffer.append(endstr);  
                buffer = buffer.getBlob();  
            }  
            if (!tt._accesstoken) return callback("not authorize");  
            var post_data = buffer;  
            //必须使用multipart/form-data  
            var post_headers = {  
                'Content-Type': 'multipart/form-data;boundary=' + boundary  
            };  
            console.log(builder);  
            tt._request("POST", baseurl + 'statuses/upload' + '.json', post_headers, post_data, tt._accesstoken, callback);  
  
        });  
    },  
  
    read_file: function(pic, callback) {  
        if (typeof(pic) === 'string') {  
            fs.stat(pic,  
            function(err, stats) {  
                fs.readFile(pic,  
                function(err, file_buffer) {  
                        console.log(err);  
                    if (!err) callback(file_buffer);  
                });  
            });  
        } else {  
            callback(pic);  
        }  
    },  
  
};  