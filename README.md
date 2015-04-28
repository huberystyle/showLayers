# showLayers

以前写的一个 jQuery 弹层插件。

弹出框的样式内容你自己定义，展示部分交给插件代码来完成。

使用说明：

```js
$("selector").showLayers({
    closeLayer: {btn: "selector", auto: false, seconds: 3, callback: function () {}}, // 关闭层		
    maskLayer: {backgroundColor: "#000", transparent: "0.3"}, // 设置遮罩层的样式	
    mover: "selector", // 可以触发移动该层的 Selector	
    level: 1, // 正整数，数字越到层级越高，默认为 1	
    Scroll: boolean, // true 为随屏滚动 false 为不滚动，默认为 false
    callback: function () {}, // 触发此插件后执行的回调函数
})
```

```js
$("selector").closeLayers(callback); // 用于其他事件关闭层，callback 为关闭层后执行的回调函数
```
