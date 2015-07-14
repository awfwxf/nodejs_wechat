/**
 * Created by Administrator on 15-7-13.
 */
var express = require('express');
var app = express();
var middlewares = require('express-middlewares-js');
var Wechat = require('./lib/wechat.js');
var msgRouter = require('./routes/msg-router.js');


var opt = {
    token: 'xfssHighLanderWechatToken',
    url: '/wechat'
};

app.use('/wechat', middlewares.xmlBodyParser({
    type: 'text/xml'
}));

// you can also work with other restful routes
app.use('/api', middlewares.bodyParser());
app.set('port', process.env.PORT || 80);


var wechat = new Wechat(opt);
//
app.get('/wechat', wechat.verifyRequest.bind(wechat));
app.post('/wechat', wechat.handleRequest.bind(wechat));


//wechat对象传递级router处理
msgRouter(wechat);

//
app.listen(app.get('port'));
console.log('Server listening on port ' + app.get('port'));