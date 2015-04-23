# showLayers
以前写的一个jQuery弹层插件

弹出框的样式内容你自己定义，展示部分交给插件代码来完成。

使用说明：

$("selector").showLayers({
    closeLayer:{btn:"",auto:false,seconds:3,callback:function(){}}, // 关闭层		
    maskLayer:{backgroundColor:"#000",transparent:"0.3"}, // 设置遮罩层的样式	
    mover:"selector", // 可以触发移动该层的Selector	
    level:1 // 正整数，数字越到层级越高，默认为1	
    Scroll:boolean // true 为随屏滚动 false 为不滚动，默认为false
    callback:function(){}, // 触发此插件后执行的回调函数
})

$("selector").closelayer(callback); // 用于其他事件关闭弹出层，callback为关闭弹出层后执行的回调函数