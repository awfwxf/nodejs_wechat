/**
 * Created by Administrator on 15-7-15.
 */

//
var ApiCache=require('../lib/apiParamsCache');

/**
 * @param req
 * @param res
 */
function router(req, res) {

    //Use req.params, req.body, or req.query instead
    var apiType=req.query.type;
    var openId=req.query.openid;
    var orderNo=req.query.orderno;
    //
    var params=ApiCache.get(openId);

    console.log(JSON.stringify(params));

    res.end('done');
}

exports.router=router;
