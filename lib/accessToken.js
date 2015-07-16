/**
 * Created by Administrator on 15-7-15.
 */
var config = require('../config')();
var request = require('request');
var fs = require('fs');

var exports = module.exports;

var CacheFilePath='./lib/accessTokenCache.json';
//token过期秒数(7200秒=2个小时)
//var tokenTimeoutMilSecond=7000*1000;

/**
 * 从缓存中获取access_token
 * @param callback
 */
function getCacheAccessToken(callback){
    fs.readFile(CacheFilePath,'utf-8',function (err, data) {
        if(err){
            callback(err);
        }else{
            //校验时间是否在有效范围内
            if(data){
                var token=JSON.parse(data);
                if(token.access_token  && token.time>= new Date().getTime()){
                    //access_token在有效范围内则回传
                    callback(null,token.access_token);
                }else{
                    //回传null
                    callback(null,null);
                }
            }else {
                //回传null
                callback(null,null);
            }
        }
    });
}

/**
 * 缓存accesstoken
 * @param token
 * @param expires_in
 * @param callback
 */
function setCacheAccessToken(token , expires_in , callback){
    if(token && expires_in){
        //安全起见用token过期秒数-200秒做缓冲
        var cache={access_token : token, time : new Date().getTime()+((expires_in-200) * 1000) };
        ;
        fs.writeFile(CacheFilePath , JSON.stringify(cache) , callback);
    }else{
        callback('setCacheAccessToken error...');
    }
}


/**
 * 从微信服务器获取新access_token
 * @param callback
 */
function getAccessTokenFromWechat(callback){
    var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=' + config.appId + '&secret=' + config.appSecret;
    request.get(tokenUrl, function(error, response, body) {
        if (error) {
            callback('getAccessTokenFromWechat error: '+error);
        }else {
            try {
                var AccessToken=JSON.parse(body);
                var token = AccessToken.access_token;
                var expires_in=AccessToken.expires_in;
                callback(null, token , expires_in);
            }
            catch (e) {
                callback('getToken error:'+e);
            }
        }
    });
}

function getAccessToken(callback){
    //先从缓存中获取
    getCacheAccessToken(function(err , token){
        if(token){
            //存在并有效
            console.log('access_token is from cache....');
            //回调
            callback(null,token);
        }else{
            //不存在或已过期，从微信服务器获取
            getAccessTokenFromWechat(function(err,token,expires_in){
                if(err){
                    callback(err);
                }else{
                    //缓存
                    setCacheAccessToken(token,expires_in,function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log('access_token is saved....');
                        }
                    });
                    //回调
                    console.log('access_token is from wechat server....');
                    callback(null,token);
                }
            });
        }
    });

}

exports.getAccessToken=getAccessToken;