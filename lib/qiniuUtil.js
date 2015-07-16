/**
 * Created by fight on 2015/7/16.
 */
var request = require('request');
var qiniu=require('qiniu');


qiniu.conf.ACCESS_KEY = 'srmwK0q2gPuWmZmDMfML6H7OWpmM-mNa-wonVp8F';
qiniu.conf.SECRET_KEY = 'Ga4ChseqBYrCfVRRh-l7YxTAD9dY_db5HgOuhkqT';

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
        //json:true,
       // body: body  //{data:{channel : "aaa",appkey : "bbb"},sign : "ccc",token : "ddd"}
    };
    request(options, callback);
}



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
    //var body={source : "wechat"};
    //
    var accessToken=qiniu.util.generateAccessToken(fromUrl,null);
    //
    var qiniuUrl='http://iovip.qbox.me/fetch/'+fromFetchUrl+'/to/'+entryURI;
    //
    sendPostRequest(qiniuUrl,accessToken,callback);
}

exports.fetch=fetch;

/*已收到您提交的视频：
comingUserId:oANM9uOlah7w-3IVUObiOFlYoJNQ
MediaId:yZomEIPXk9R3InL_3q4L9d604L_42Hsv61_XWU_lXeBOGB8MNOdk1tFql00vJ-er
ThumbMediaId:HWiTd9j1-7qpFKq4YpW0EtE0wQUu9TG9w2KQkgfnlKUtLg3gM4wfWbPFWZw9ZwvH
 (function test(){

 })();
*/

