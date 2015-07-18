/**
 * Created by Administrator on 15-7-17.
 */

var _cache={};

//超时时间10分钟过期 单位：毫秒
var timeoutMilsecond=1000*60*10;

/**
 *
 * @param key
 * @param value
 */
exports.set=function(key,value){
    //过期时间
    var expireTime=new Date().getTime()+timeoutMilsecond;
    if(typeof value == "object"){
        value['expireTime']=expireTime;
    }
    _cache[key]=value;
}

exports.get=function(key){
    return _cache[key];
}


exports.del=function(key){
    _cache[key]=null;
}

/**
 * 间隔执行删除超时的缓存数据 (服务器启动后就会执行)
 */
/**/
setInterval(function(){
    var curTime=new Date().getTime();
    for(var obj in _cache){
        var tempObj=_cache[obj];
        if(tempObj){
            var expireTime=tempObj['expireTime'];
            if(expireTime<curTime){
                //过期，置为null清空,让虚拟机回收
                _cache[obj]=null;
            }
        }
    }
},2000);