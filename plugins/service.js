(function(sdk){
    var Service = function(config){
        var websocket = window.WebSocket||window.MozWebSocket;
        var context = null;
        var isClose = false;
        var isReconnect = false;
        var socketEvents = {
            open: function(){
                if(isReconnect){
                    this.emitEvent('reconnect', {status: 1, desc: '服务重连成功'});
                }else this.emitEvent('ready', {desc: '服务启动'});
            },
            close: function(){
                if(isClose){
                    //主动关闭
                    this.emitEvent('close', {desc: '服务已关闭'});
                }else{
                    //网络或异常关闭时进行重连
                    if(config.reconnect){
                        //配置允许重连
                        isReconnect = true;
                        this.emitEvent('reconnect', {status: 0, desc: '服务开始重连'});
                    }
                }
            },
            error: function(){
                if(isReconnect) this.emitEvent('reconnect', {status: -1, desc: '服务重连失败'});
                else this.emitEvent('error', {desc: '服务异常'});
            },
            message: function(e){
                if(sdk.Util.isString(e.data)){
                    var data = JSON.parse(e.data);
                    this.emitEvent('message', {desc: '服务响应信息', data: data});
                }else{
                    //二进制
                }
            }
        };
        var connect = function(url){
            //连接websocket
            var socket = new websocket(url);
            for(var event in socketEvents){
                socket.addEventListener(event, socketEvents[event]);
            }
        }
        var Inner = function(){};
        Inner.prototype = new sdk.BaseEvent();
        Inner.prototype.constructor = Inner;
        Inner.prototype.start=function(){
            //启动服务
            if(!this.isLive()) {
                isClose = false;
                isReconnect = false;
                if(config.url) connect(config.url);
                else this.emitEvent('fail', {desc: '服务地址未设置'});
            }else{
                this.emitEvent('fail', {desc: '服务正在运行中'});
            }
        };
        Inner.prototype.stop=function(){
            //停止服务
            if(this.isLive()){
                isClose = true;
                isReconnect = false;
                context.close();
            }
        };
        Inner.prototype.isLive=function(){
            //服务是否存活
            return context && context.readystate==websocket.OPEN;
        };
        Inner.prototype.send=function(data){
            //向服务发送数据
            if(this.isLive()){
                if(sdk.Util.isObject(data)) data = JSON.stringify(data);
                if(sdk.Util.isString(data)) context.send(data);
                else this.emitEvent('fail', {desc: '发送数据格式不对'})
            }
        };
        Inner.prototype.sendCommand=function(command, data){
            //向服务发送指令
            this.send(Object.assign({
                command: command
            }, data||{}));
        };
        Inner.prototype.sendBinary=function(binary){
            //向服务发送二进制
            if(this.isLive()){
                if(binary && binary.length) context.send(binary);
                else this.emitEvent('fail', {desc: '发送数据不是二进制的'});
            }
        };
        return new Inner();
    };
    
    sdk.Service = Service;
})(window.OcmoonContext);