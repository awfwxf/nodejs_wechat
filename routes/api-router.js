/**
 * Created by Administrator on 15-7-15.
 */
var utils=require('../lib/util.js');
var AccessToken=require('../lib/accessToken');
var qiniuUtil=require('../lib/qiniuUtil');
var exports = module.exports;
//
var ApiCache=require('../lib/apiParamsCache');

/**
 * 前、后端API接口入口
 * 前端：用户在前端界面 点提交后继续上传图片，要写一个API让前端去用，这个API调用客服接口，发出一条提示信息 ：
 * "已收到前面提交的任务反馈，请点选右下角的+，然后选择小视频"，上传接收到小视频后通知七牛去fetch，并将任务反馈的id+openid等结果告诉后端
  微信多媒体文件下载接口：http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID
     comingUserId:oANM9uOlah7w-3IVUObiOFlYoJNQ
     MediaId:Lzg9mCCxm25ISax00t8PcGixox8_qF_5TYL6puqsQmuYh7VX1jf8fUtlzRBu1aIN
     ThumbMediaId:cQARzHoqi58t7v0oKty_TYolbwXl2e_U_3onm3KwBIi0EsfNE1vZ0Yxan6vHsyOD

     调用结果,result结果返回码：
     0：成功
     10：无效的type类型
     11：无效的openid
     12：无效的orderno
     13：openid或orderno为空

     出现下述错误，回复体中会包含msg存储具体的错误描述
     20: 调用微信发送消息接口时异常
     21: 微信服务器返回的错误

 * @param req
 * @param res
 */
function router(req, res) {

    //Use req.params, req.body, or req.query instead
    var apiType=req.query.type;
    var openId=req.query.openid;
    var orderNo=req.query.orderno;

    var resutlObj=new Object();
    resutlObj.msg='';

    if(apiType){
        if(apiType === 'sendmsg'){
            if(openId && orderNo){
                //发送选择并上传小视频的消息给指定用户
                sendUploadVideoMsgToUser(openId,function(error, response, body) {

                    if(error){
                        //回复调用端
                        resutlObj.result='20';
                        resutlObj.msg=error;
                        res.end(JSON.stringify(resutlObj));
                    }else{
                        if(body.errcode===0){
                            //成功
                            //添加到缓存
                            var params={openid : openId , orderno : orderNo};
                            ApiCache.set(openId,params);
                            //回复调用端
                            resutlObj.result='0';
                            res.end(JSON.stringify(resutlObj));
                        }else{
                            //失败
                            resutlObj.result='21';
                            resutlObj.msg=body.errcode+' : '+body.errmsg;
                            res.end(JSON.stringify(resutlObj));
                        }
                    }
                });
            }else{
                resutlObj.result='13';
                //回复调用结果
                res.end(JSON.stringify(resutlObj));
            }
        }else{
            //没有匹配的type
            resutlObj.result='10';
            //回复调用结果
            res.end(JSON.stringify(resutlObj));
        }
    }else{
        resutlObj.result='10';
        //回复调用结果
        res.end(JSON.stringify(resutlObj));
    }

    //向指定用户发送消息
    /*var msgObj={
        touser:"oANM9uOlah7w-3IVUObiOFlYoJNQ",
        msgtype:"text",
        text:
        {
            content: "已收到前面提交的任务反馈，请点选右下角的+，然后选择小视频"
        }
    };
    utils.sendMsgToUser(msgObj,function(error, response, body) {
        console.log(body);
    });*/

    //七牛fetch资源
    /*var url='http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=bgfZ1dX-Qh4EBCXFRbhYU52DRXzOD8cetjekqOMqLnNuRLZF3rmZ4scmZg40b626MtHiwFNOW4KxccvZBy_I14w4qLt894siMGXRbm1De-g&media_id=yZomEIPXk9R3InL_3q4L9d604L_42Hsv61_XWU_lXeBOGB8MNOdk1tFql00vJ-er';
    qiniuUtil.fetch(url,'wechatShortVideo.mp4',function(error, res, body) {
        if(error){
            console.log(error);
        }else{
            console.log(res.statusCode);
            console.log(body);
        }
    });*/

}

exports.router=router;


function sendUploadVideoMsgToUser(openid,callback){
    var msgObj={
        touser: openid,
        msgtype:"text",
        text:
        {
            content: "已收到前面提交的任务反馈，请点选右下角的+，然后选择小视频"
        }
    };
    utils.sendMsgToUser(msgObj,callback);
}