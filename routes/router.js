/**
 * Created by Administrator on 15-7-15.
 */

var Wechat = require('../lib/wechat');
var msgRouter = require('./msg-router');
var API=require('./api-router');
//config
var config = require('../config')();

module.exports=function(app){

    var wechat = new Wechat(config);
    //
    app.get('/wechat', wechat.verifyRequest.bind(wechat));
    app.post('/wechat', wechat.handleRequest.bind(wechat));
    //
    app.get('/wxapi', API.router);

    //消息处理路由
    msgRouter(wechat);
}