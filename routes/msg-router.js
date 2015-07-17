/**
 * Created by fight on 2015/7/14.
 */
var utils=require('../lib/util.js');

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

    session.replyTextMessage('您好！欢迎关注“幸福三沙”官方微信。幸福三沙带你走进美丽三沙，参与三沙生态环境建设，领略三沙独特风情，还等什么，快来一起体验三沙的魅力！\n ' +
        '<a href="http://1.frameworktv.sinaapp.com/">美丽三沙</a>');

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
    var ThumbMediaId = session.incomingMessage.ThumbMediaId;

    var rspText='已收到您提交的视频：\n comingUserId:'+comingUserId+'\n MediaId:'+MediaId+'\n ThumbMediaId:'+ThumbMediaId;

    session.replyTextMessage(rspText);
    //

}

