/**
 * Created by Administrator on 15-7-15.
 */
var utils=require('../lib/util.js');
var AccessToken=require('../lib/accessToken');
var exports = module.exports;

/**
 * 前、后端API接口入口
 * 前端：用户在前端界面 点提交后继续上传图片，要写一个API让前端去用，这个API调用客服接口，发出一条提示信息 ：
 * "已收到前面提交的任务反馈，请点选右下角的+，然后选择小视频"，上传接收到小视频后通知七牛去fetch，并将任务反馈的id+openid等结果告诉后端
  微信多媒体文件下载接口：http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID
 comingUserId:+oANM9uOlah7w-3IVUObiOFlYoJNQ
 MediaId:Lzg9mCCxm25ISax00t8PcGixox8_qF_5TYL6puqsQmuYh7VX1jf8fUtlzRBu1aIN
 ThumbMediaId:cQARzHoqi58t7v0oKty_TYolbwXl2e_U_3onm3KwBIi0EsfNE1vZ0Yxan6vHsyOD

 * @param req
 * @param res
 */
function router(req, res) {

    console.log(req.param('type'));
    console.log(req.param('openid'));
    console.log(req.param('taskid'));

    //向指定用户发送消息
    var msgObj={
        touser:"oANM9uOlah7w-3IVUObiOFlYoJNQ",
        msgtype:"text",
        text:
        {
            content: "已收到前面提交的任务反馈，请点选右下角的+，然后选择小视频"
        }
    };
    utils.sendMsgToUser(msgObj,function(error, response, body) {
        console.log(body);
    });
    res.end('done....');
}

exports.router=router;