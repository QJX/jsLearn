var PubSub = {
  subscribe: function (ev, callback) {
    // 创建 _callbacks 对象，除非它已经存在了
    var calls = this._callbacks || (this._callbacks = {});
    // 针对给定的事件 key 创建一个数组，除非这个数组已经存在
    // 然后将回调函数追加到这个数组中
    (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
    return this;
  },
  publish: function() {
    // 将 arguments 对象转换为真正的数组
    var args = Array.prototype.slice.call(arguments, 0);
    // 拿出第 1 个参数，即事件名称
    var ev = args.shift();
    // 如果不存在 _callbacks 对象，则返回
    // 或者如果不包含给定事件对应的数组
    var list, calls, i, l;
    if (!(calls = this._callbacks)) return this;
    if (!(list = this._callbacks[ev])) return this;
    // 触发回调
    for (i = 0, l = list.length; i < l; i++)
      list[i].apply(this, args);
    return this;
  }
};

// 使用方法
PubSub.subscribe("wem", function(){
  console.log('this:',this,'arguments',arguments)
});

PubSub.publish("wem", 12,34,5634,'caogen');

// 局部使用 =======================
var Asset = {};
// 添加 PubSub
jQuery.extend(Asset, PubSub);
// 现在就可以用 publish/subscribe 函数了
Asset.subscribe("create", function(){
// ...
});

// ====================================
(function($){
  var o = $({});

  $.subscribe = function() {
    o.bind.apply( o, arguments );
  };

  $.unsubscribe = function() {
    o.unbind.apply( o, arguments );
  };

  $.publish = function() {
    //console.log(arguments)
    o.trigger.apply( o, arguments );
  };
  
})(jQuery);

$.subscribe( "/some/topic", function( event, data ) {
  console.log( event.type,  data);
});
$.publish( "/some/topic", {name:'caogen', age:'25'} );