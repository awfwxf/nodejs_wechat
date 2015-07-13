/**
 * Created by Administrator on 15-7-11.
 */
var http = require('http');
var xmlBodyParser = require('express-xml-parser');
//var Wechat = require('nodejs-wechat');
var Wechat = require('./index.js');

var opt = {
    token: 'xfssHighLanderWechatToken',
    url: '/wechat'
};
var parse = xmlBodyParser({
    type: 'text/xml'
});

var wechat = new Wechat(opt);

//
wechat.on('event.subscribe', function(session) {
    console.log('wechat on event.subscribe!');
    session.replyTextMessage('您好！欢迎关注“幸福三沙”官方微信。幸福三沙带你走进美丽三沙，参与三沙生态环境建设，领略三沙独特风情，还等什么，快来一起体验三沙的魅力！\n ' +
        '<a href="http://1.frameworktv.sinaapp.com/">幸福三沙</a>');
    
});

//
wechat.on('text', function(session) {
    console.log('wechat on text message!');
    var comingMsg=session.incomingMessage.Content;
    var comingUser=session.incomingMessage.FromUserName;
    var sendMsg='你的openid是：\n'+comingUser+' \n 请将此告知系统管理员。';
    if(comingMsg === '树木管理员'){
        sendMsg='请点击 <a href="http://112.124.8.40:8000/sansha/#/upcoming">树木管理员</a>';
    }
    session.replyTextMessage(sendMsg);
});


var server = http.createServer(function(req, res) {
    if (req.method === 'GET') {
        wechat.verifyRequest(req, res);
    } else {
        parse(req, res, function(err) {
            if (err) {
                res.end('parse error!!');
                console.log('parse error!! ');
                return;
            }
            wechat.handleRequest(req, res);
        });
    }
});
server.listen(80);
//
console.log('Server running at port 80');