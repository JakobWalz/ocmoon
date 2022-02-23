(function(sdk){
    //缓存绑定的各类事件
    var eventMap = {};
    //基础事件类定义
    var BaseEvent = function(){};
    BaseEvent.prototype.bindEvent=function(eventName, eventCallback, once){
        //绑定新事件
        var obj = {};
        if(sdk.Util.isString(eventName) && sdk.Util.isFunction(eventCallback)){
            obj[eventName] = eventCallback;
        }else if(sdk.Util.isObject(eventName)) obj = eventName;
        for(var key in obj){
            if(!this.isBindEvent(key)) eventMap[key] = [];
            eventMap[key].push({
                callback: eventCallback,
                once: !!once //只被执行一次事件
            });
        }
    };
    BaseEvent.prototype.unbindEvent=function(eventName, eventCallback){
        //解绑事件
        if(this.isBindEvent(eventName, eventCallback)){
            var event = eventMap[eventName];
            if(eventCallback){
                var index = event.findIndex(function(item){
                    return item.callback===eventCallback;
                });
                event.splice(index, 1);
            }else{
                event = [];
            }
            if(event.length==0) {
                eventMap[eventName] = null;
                delete eventMap[eventName];
            }
        }
    };
    BaseEvent.prototype.isBindEvent=function(eventName, eventCallback){
        //是否绑定事件
        return this.sizeOfEvent(eventName, eventCallback)>0;
    };
    BaseEvent.prototype.sizeOfEvent=function(eventName, eventCallback){
        //事件个数
        var size = 0;
        for(var key in eventMap) {
            if(eventName) {
                if(eventCallback){
                    //某事件
                    var event = eventMap[key];
                    var index = event.findIndex(function(item){
                        return item.callback==eventCallback;
                    });
                    if(index!=-1) size+=1;
                }else if(key==eventName){
                    size+=1;
                }
            }else size+=1;
        }
        return size;
    };
    BaseEvent.prototype.emitEvent=function(eventName, data){
        //执行事件
        if(this.isBindEvent(eventName)){
            var event = eventMap[eventName];
            event.forEach(function(item){
                item.callback.call(this, data);
                if(item.once) this.unbindEvent(eventName, item.callback);
            }.bind(this));
        }
    };
    BaseEvent.prototype.clearEvent=function(){
        //清空事件
        eventMap = {};
    };
    sdk.BaseEvent = BaseEvent;
})(window.OcmoonContext);