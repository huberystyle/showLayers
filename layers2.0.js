/*
 show layer v2.0
 Author: Hu Yicheng
 Update:2014-04-10
 Usage:
 	// show Layer
 	$("selector").showLayers({
		closeLayer:{btn:"",auto:false,seconds:3,callback:fn},
		maskLayer:{backgroundColor:"color",transparent:"0.1-1"},
		mover:"move element",
		level:1, //正整数，数字越到层级越高，默认为1
		Scroll:bollean, // 设置层是否随屏滚动 默认为否
		callback:fn
	});
	// close layer
	$("selector").closeLayers(callback);

*/

(function($){
	$.fn.extend({
		// show layer
		showLayers:function(options){
			var defaults = {closeLayer:{btn:".close",auto:false,seconds:3,callback:function(){}},maskLayer:{backgroundColor:"#000",transparent:"0.5"},mover:"",level:1,Scroll:false,callback:function(){}},opt = $.extend(defaults,options),interval = 0;
			var Layers = {
				arrayMap:function(){
					if(!Array.prototype.map){
						Array.prototype.map = function(fn,scope) {
							var result = [],ri = 0;
							for (var i = 0,n = this.length; i < n; i++){
								if(i in this){result[ri++]  = fn.call(scope ,this[i],i,this);}
							}
							return result;
						};
					}
				},
				getWinSize:function(){
					return ["Height","Width"].map(function(name){
					  return window["inner"+name] ||
						document.compatMode === "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name ]
					});
				},
				locateLayer:function(obj){
					var _t = this,w = [],left,top;
					w = _t.getWinSize();
					left = (w[1]-obj.outerWidth(true))/2;
					left = left > 0 ? left : 0;
					top = (w[0]-obj.outerHeight(true))/2;
					top = top > 0 ? top : 0;
					if(opt.Scroll){
						obj.css({"position":"absolute","left":left+"px","top":(top+$(document).scrollTop())+"px"});
					}else{
						if(!window.XMLHttpRequest){
							obj.css({"position":"absolute","left":left+"px","top":(top+$(document).scrollTop())+"px"});
							$(window).scroll(function(){
								obj.css("top",(top+$(document).scrollTop())+"px");
							});
						}else{
							obj.css({"position":"fixed","top":top+"px","left":left+"px"});
						}
					}
				},
				showLayer:function(obj,l){
					var zIndex = ((typeof opt.level == "number") ? (parseInt(opt.level) * 10)+50 : 50)+l*2;
					obj.css({"z-index":zIndex,"display":"block"});
					this._addMaskLayer(zIndex);
					opt.hasOwnProperty("callback")? opt.callback():"";
				},
				_closeLayer:function(obj){
					clearTimeout(interval);
					obj.css({"display":"none"});
					this._removeMaskLayer(obj.css("zIndex")-1);
					opt.closeLayer.hasOwnProperty("callback")? opt.closeLayer.callback():"";
					$(opt.mover,obj).unbind();
				},
				autoCloseLayer:function(obj){
					if(obj.css("display") == "none") return;
					var _t = this;
					interval = setTimeout(function(){
						_t._closeLayer(obj);
					},parseInt(opt.closeLayer.seconds)*1000);
				},
				_addMaskLayer:function(zI){
					var opacity = opt.maskLayer.transparent, alphaOpacity = parseFloat(opt.maskLayer.transparent)*100,backgroundColor = opt.maskLayer.backgroundColor;
					var maskPosition = !window.XMLHttpRequest ? "absolute":"fixed";
					var maskHeight = !window.XMLHttpRequest ? $(document).height():"100%";
					if($(".popUpMaskLayer"+parseInt(zI-1)).length == 0){
						$("<div class='popUpMaskLayer"+parseInt(zI-1)+"'></div>").appendTo("body");
					}
					$(".popUpMaskLayer"+parseInt(zI-1)).css({"width":"100%","height":maskHeight,"background-color":backgroundColor,"opacity":opacity, "-moz-opacity":opacity,"filter":"alpha(opacity="+alphaOpacity+")","position":maskPosition,"left":0,"top":0,"z-index":zI-1});
				},
				_removeMaskLayer:function(zI){
					if($(".popUpMaskLayer"+zI).length > 0){
						$(".popUpMaskLayer"+zI).remove();
					};
				},
				moveLayer:function(obj){
					$(opt.mover,obj).bind({
						"mousedown":function(e) {
							if (!e) e = window.event;
							var posX = e.clientX - parseInt(obj.css('left'));
							var posY = e.clientY - parseInt(obj.css('top'));
							$(document).bind("mousemove", {x:posX, y:posY}, function(e) {
								var ltop,lleft,lmaxleft,pos = e.data;
								if (!e) e = window.event;
								lmaxleft = document.body.clientWidth -obj.outerWidth(true);
								lmaxTop = (opt.Scroll ? document.body.clientHeight : $(window).height()) - obj.outerHeight(true);			
								if((e.clientY - pos.y >= 0) && (e.clientY - pos.y <= lmaxTop) && (e.clientX - pos.x >= 0) && (e.clientX - pos.x <= lmaxleft)){
									ltop = e.clientY - pos.y;
									lleft = e.clientX - pos.x;
									obj.css({'top':ltop,'left':lleft});
								}else if(e.clientY - pos.y < 0){
									$(document).unbind("mousemove");
								}
							});
						},
						"mouseup":function() {
							$(document).unbind("mousemove");
						}
					}).css("cursor","move");
				},
				bind:function(obj){
					var _t = this;
					if($(opt.closeLayer.btn,obj).length > 0){
						$(opt.closeLayer.btn,obj).click(function(){
							_t._closeLayer(obj);
						});
					}
					$(window).resize(function(){
						_t.locateLayer(obj);
					});
				},
				init:function(obj,l){
					if(obj.length <= 0) return;
					this.arrayMap();
					this.locateLayer(obj);
					this.showLayer(obj,l);
					this.bind(obj);
					if(opt.closeLayer.auto){
						this.autoCloseLayer(obj);
					}
					if(!!opt.mover){
						this.moveLayer(obj);
					}	
				}
			};
			return this.each(function(l){
				Layers.init($(this),l);
			});
		},
		
		// close layer
		closeLayers:function(callback){
			return this.each(function(){
				$(this).css("display","none");
				var zI = parseInt($(this).css("zIndex"))-1;
				if($(".popUpMaskLayer"+zI).length > 0){
					$(".popUpMaskLayer"+zI).remove();
				};
				if(!!callback){
					callback();
				}
			});
		}
		
	});
})(jQuery);