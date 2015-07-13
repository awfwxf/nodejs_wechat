/**
 * Created by Administrator on 15-7-13.
 */
var express = require('express');
var app = express();
var middlewares = require('express-middlewares-js');
var Wechat = require('./lib/wechat.js');

/*
 Alternative way

 var xmlBodyParser = require('express-xml-parser');
 app.use('/weixin', xmlBodyParser({
 type: 'text/xml',
 limit: '1mb'
 }));
 */

var opt = {
    token: 'xfssHighLanderWechatToken',
    url: '/wechat'
};

app.use('/wechat', middlewares.xmlBodyParser({
    type: 'text/xml'
}));

var wechat = new Wechat(opt);

app.get('/wechat', wechat.verifyRequest.bind(wechat));
app.post('/wechat', wechat.handleRequest.bind(wechat));

app.set('port', process.env.PORT || 80);

// you can also work with other restful routes
app.use('/api', middlewares.bodyParser());

wechat.on('text', function(session) {console.log('wechat on text message!');
    var comingMsg=session.incomingMessage.Content;
    var comingUser=session.incomingMessage.FromUserName;
    var sendMsg='您的openid是：\n'+comingUser+' \n 请将此告知系统管理员。';
    if(comingMsg === '树木管理员'){
        sendMsg='请点击 <a href="http://112.124.8.40:8000/sansha/#/upcoming">树木管理员</a>';
    }
    session.replyTextMessage(sendMsg);
});

//
wechat.on('event.subscribe', function(session) {
    console.log('wechat on event.subscribe!');
    session.replyTextMessage('您好！欢迎关注“幸福三沙”官方微信。幸福三沙带你走进美丽三沙，参与三沙生态环境建设，领略三沙独特风情，还等什么，快来一起体验三沙的魅力！\n ' +
        '<a href="http://1.frameworktv.sinaapp.com/">幸福三沙</a>');

});

app.listen(app.get('port'));

console.log('Server listening on port ' + app.get('port'));