/**
 * Created by fight on 2015/7/14.
 */

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
        '<a href="http://1.frameworktv.sinaapp.com/">幸福三沙</a>');

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
 */
function onShortVideoMsg(session) {
    var comingUserId = session.incomingMessage.FromUserName;
    var CreateTime = session.incomingMessage.CreateTime;
    var MediaId = session.incomingMessage.MediaId;
    var ThumbMediaId = session.incomingMessage.ThumbMediaId;

    var rspText='comingUserId:'+comingUserId+'\n MediaId:'+MediaId+'\n ThumbMediaId:'+ThumbMediaId;

    session.replyTextMessage(rspText);

}