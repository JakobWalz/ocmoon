(function(sdk){
    //类型键值
    var typeMap = {
        string: 'string',
        object: 'object',
        number: 'number',
        boolean: 'boolean',
        function: 'function',
        array: 'array'
    };
    //判断类型
    var checkType = function(obj, type){
        return Object.prototype.toString.call(obj).replace(/^\[object ([^\]]+)\]$/g, '$1').toLowerCase()==type;
    };
    //常用对象定义
    sdk.Util = {
        isString: function(obj){
            //判断字符串
            return checkType(obj, typeMap.string);
        },
        isObject: function(obj){
            //判断对象
            return checkType(obj, typeMap.object);
        },
        isNumber: function(obj){
            //判断数字
            return checkType(obj, typeMap.number);
        },
        isBoolean: function(obj){
            //判断布尔值
            return checkType(obj, typeMap.boolean);
        },
        isFunction: function(obj){
            //判断函数
            return checkType(obj, typeMap.function);
        },
        isArray: function(obj){
            //判断数组
            return typeMap(obj, typeMap.array);
        },
        copyObject: function(obj1, obj2, deep){
            //复制对象
        }
    };
})(window.OcmoonContext);