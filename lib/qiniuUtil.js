/**
 * Created by fight on 2015/7/16.
 */
var request = require('request');
var qiniu=require('qiniu');


qiniu.conf.ACCESS_KEY = 'srmwK0q2gPuWmZmDMfML6H7OWpmM-mNa-wonVp8F';
qiniu.conf.SECRET_KEY = 'Ga4ChseqBYrCfVRRh-l7YxTAD9dY_db5HgOuhkqT';

//bucket空间名称
var BucketName='tree';

/**
 * request模块的post方法封装
 * @param url  post的url地址
 * @param body object类型的json格式
 * @param callback 回调函数
 *
 * iovip.qbox.me
 * //"User-Agent" : qiniu.conf.USER_AGENT,
 */
function sendPostRequest(url,auth,callback){
    var options = {
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : auth
        },
        url: url,
        method: 'POST'
    };
    request(options, callback);
}


/**
 * 调用七牛fetch资源
 * @param fromUrl
 * @param fileNameKey   文件名，如未指定文件名为hash值
 * @param callback
 *
 成功的回复：{
            "hash": "<hash>",
            "key":  "<key>"
        }

 失败的回复：{
            "error":   "<errMsg    string>",
        }
 */
function fetch(fromUrl,fileNameKey,callback){

    //格式：qiniuphotos:gogopher.jpg
    var EncodedEntryURI=BucketName;
    if(fileNameKey){
        EncodedEntryURI=BucketName+':'+fileNameKey;
    }
    var entryURI=qiniu.util.urlsafeBase64Encode(EncodedEntryURI);
    //safe64编码的fetch源url
    var fromFetchUrl=qiniu.util.urlsafeBase64Encode(fromUrl);
    //
    var qiniuUrl='http://iovip.qbox.me/fetch/'+fromFetchUrl+'/to/'+entryURI;
    //
    var accessToken=qiniu.util.generateAccessToken(qiniuUrl,null);
    //
    sendPostRequest(qiniuUrl,accessToken,callback);
}

exports.fetch=fetch;




