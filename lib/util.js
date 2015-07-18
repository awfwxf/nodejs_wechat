var util = require('util');
var crypto = require('crypto');
var request = require('request');
var accessToken=require('./accessToken');

//
var exports = module.exports;

function sha1(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  return shasum.digest('hex');
}
exports.sha1 = sha1;

/**
 * Parse xml-json to json. xml-json is the return value of xml2js.parseString
 * @param  {xml-json} xmlJson
 * @return {json}
 */
function stripXmlJson(xmlJson) {
  return _strip(xmlJson.xml);
  function _strip(json) {
    var res = json;
    if (util.isArray(json)) {
      res = [];
      for(var i=0; i<json.length; ++i) {
        res.push(_strip(json[i]));
      }
    } else if (typeof json === 'object') {
      res = {};
      for (var field in json) {
        res[field] = _strip(json[field][0]);
      }
    }
    return res;
  }
}
exports.stripXmlJson = stripXmlJson;

function signature(toSignData) {
  if (!util.isArray(toSignData)) {
    toSignData = Array.prototype.slice.apply(arguments);
  }
  return sha1(toSignData.sort().join(''));
}
exports.signature = signature;

/**
 * 根据给定的的参数选项发起请求
 *
 var options = {
        headers: {"Connection": "close"},
        url: url,
        method: 'POST',
        json:true,
        body: body  //{data:{channel : "aaa",appkey : "bbb"},sign : "ccc",token : "ddd"}
    };
 */
exports.request = function(requestOptions,callback){
    request(requestOptions, callback);
}

/**
 * request模块的post方法封装
 * @param url  post的url地址
 * @param body object类型的json格式
 * @param callback 回调函数
 */
function sendPostRequest(url,body,callback){
    var options = {
        headers: {"Connection": "close"},
        url: url,
        method: 'POST',
        json:true,
        body: body  //{data:{channel : "aaa",appkey : "bbb"},sign : "ccc",token : "ddd"}
    };
    request(options, callback);
}

/**
 * 添加微信客服
 * @param bodyObj
 * @param callback
 */
exports.sendMsgToUser=function(bodyObj,callback){
    //获取accessToken
    accessToken.getAccessToken(function(error,token){
        if(error){
            callback('getToken error'+error);
        }else{
            // console.log(token);
            var msgUrl='https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token;
            sendPostRequest(msgUrl,bodyObj,callback);
        }
    });
}
//exports.sendMsgToUser=sendMsgToUser;
