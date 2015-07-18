/**
 * Created by fight on 2015/7/14.
 */
var utils=require('../lib/util.js');
var qiniuUtil=require('../lib/qiniuUtil');
var AccessToken=require('../lib/accessToken');

module.exports = function (wechat) {
    //
    wechat.on('event.subscribe', function(session){onSubscribe(session)});
    //
    wechat.on('text', function(session){onTextMsg(session)});
    //
    wechat.on('shortvideo', function(session){onShortVideoMsg(session)});
};

/**
 * 订阅事件
 */
function onSubscribe(session) {

    session.replyTextMessage('您好！欢迎关注“美丽三沙”官方微信。美丽三沙带你走进美丽富饶的三沙，参与三沙生态环境建设，领略三沙独特风情，还等什么，快来一起体验三沙的魅力！');

}

/**
 * 文本消息
 */
function onTextMsg(session) {
    var comingMsg = session.incomingMessage.Content;
    var comingUser = session.incomingMessage.FromUserName;
    var sendMsg = '您的openid是：\n' + comingUser + ' \n 请将此告知系统管理员。';
    if (comingMsg === '树木管理员') {
        sendMsg = '请点击 <a href="http://112.124.8.40:8000/sansha/#/upcoming">树木管理员</a>';
    }
    if(comingMsg === '主权三沙'){
        sendMsg = '请点击 <a href="http://1.frameworktv.sinaapp.com/">美丽三沙</a>';
    }
    if(comingMsg === '授权'){
        sendMsg = '请点击 <a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxef833c0e47f56b1e&redirect_uri=http%3A%2F%2Fxfss.weicoms.com%2Fwxuser&response_type=code&scope=snsapi_userinfo&state=openstore#wechat_redirect">首页</a>';
    }
    session.replyTextMessage(sendMsg);
}


/**
 * 小视频消息
 comingUserId:+oANM9uOlah7w-3IVUObiOFlYoJNQ
 MediaId:Lzg9mCCxm25ISax00t8PcGixox8_qF_5TYL6puqsQmuYh7VX1jf8fUtlzRBu1aIN
 ThumbMediaId:cQARzHoqi58t7v0oKty_TYolbwXl2e_U_3onm3KwBIi0EsfNE1vZ0Yxan6vHsyOD
 */
function onShortVideoMsg(session) {

    var comingUserId = session.incomingMessage.FromUserName;
    var CreateTime = session.incomingMessage.CreateTime;
    var MediaId = session.incomingMessage.MediaId;
    //var ThumbMediaId = session.incomingMessage.ThumbMediaId;

    /*var rspText='已收到您提交的视频：\n comingUserId:'+comingUserId+'\n MediaId:'+MediaId;
    session.replyTextMessage(rspText);*/

    //开始调用七牛fetch资源，然后通知后端
    //获取token
    AccessToken.getAccessToken(function(error,token){
        if(error){
            //获取token异常
            var rspText='上传视频getAccessToken时失败,请联系管理员。'+error;
            session.replyTextMessage(rspText);
        }else{
            var url='http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='+token+'&media_id='+MediaId;
            qiniuUtil.fetch(url,comingUserId+'_'+new Date().getTime()+'.mp4',function(error, res, body) {
                if(error){
                    var rspText='视频上传错误,请联系管理员。'+error;
                    session.replyTextMessage(rspText);
                }else{
                    var status=res.statusCode;
                    if(status===200){
                        //成功
                        var rspText='上传成功,已收到你的视频';
                        session.replyTextMessage(rspText);
                    }else{
                        try{
                            var msgBody=JSON.parse(body);
                            var rspText='视频上传失败,请稍候重试。'+status;
                            session.replyTextMessage(rspText);
                        }catch (err) {
                            var rspText='视频上传失败 '+err;
                            session.replyTextMessage(rspText);
                        }
                    }
                }
            });
        }
    });
}
