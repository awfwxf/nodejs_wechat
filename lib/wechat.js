var events = require('events');
var url=require('url');
var util = require('./util.js');
var xmlTemplates = require('./xml-templates.js');
var Session = require('./session.js');
var nodeutil = require('util');

function Wechat(opt) {
  this.token = opt.token;
  this.url = opt.url;
}
nodeutil.inherits(Wechat, events.EventEmitter);

/**
 * Receive Messages
 * @{@link http://mp.weixin.qq.com/wiki/index.php?title=接收普通消息}
 * @{@link http://mp.weixin.qq.com/wiki/index.php?title=接收事件推送}
 * @{@link http://mp.weixin.qq.com/wiki/index.php?title=接收语音识别结果}
 * @param  {Request} req
 *         req.body should be set to xml-json
 * @param  {Response} res
 *         dependence on res.type, res.send
 */
Wechat.prototype.handleRequest = function(req, res) {
  //console.log('handleRequest Url:::  '+req.url);
  if (!this.verifyRequest(req)) {
    res.statusCode = 400;
    res.end();
    return;
  }
  //
  //console.log('handleRequest continud...');

  var session = new Session(req, res, this);
  var err = session.err;
  if (err) {
    res.statusCode = err.statusCode;
    res.end();
    this.emit('error', err);
    return;
  }
  var eventStr = session.incomingMessage.MsgType;
  console.log('incomingMessage Type: '+eventStr);
  if (eventStr == 'event') {
    eventStr += '.' + session.incomingMessage.Event;
  }
  this.emit(eventStr, session);
};

/**
 * Reply Messages
 * @{@link http://mp.weixin.qq.com/wiki/index.php?title=发送被动响应消息}
 * @param  {Session} session
 * @param  {Message} outgoingMessage 
 */
Wechat.prototype.replyMessage = function(session, outgoingMessage) {
  var msgType = outgoingMessage.MsgType;
  var template = xmlTemplates.get(msgType);
  var xml = template.apply(outgoingMessage);
  session.res.setHeader('Content-Type', 'application/xml');
  session.res.write(xml);
  session.res.end();
}

/**
 * Verify incoming request is legal
 * @{@link http://mp.weixin.qq.com/wiki/index.php?title=验证消息真实性}
 * @param  {Request} req
 * @return {Boolean}
 */
Wechat.prototype.verifyRequest = function (req, res) {
  //console.log('VerifyRequest Url: '+req.url);
  //
  var reqObj=url.parse(req.url,true);
  var params=reqObj['query'];
  var signature=params['signature'];
  var timestamp=params['timestamp'];
  var nonce=params['nonce'];
  var echostr=params['echostr'];

  //var timestamp = req.query.timestamp;
  //var nonce = req.query.nonce;
  //var echostr=req.query.echostr;
  var signatureFinal = util.signature(this.token, timestamp, nonce);

  if (signatureFinal == signature) {
    if (res) {
      res.write(echostr);
      res.end();
    }
    return true;
  } else {
    if (res) res.end('not a Wechat server!!!');
    return false;
  }
};

module.exports = Wechat;


