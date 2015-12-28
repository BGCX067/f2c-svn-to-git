/* *
 * Combo design for:
 alert, dialog, prompt, tooltip, hint, notice
 history: 
 	2008-11-10 许健 + blurHint options(onengage, onrealse) to blurHint
 	2008-11-20 许健 + $selector.spring()
 	2008-11-24 luli 解决notice和alert共存显示
 	2009-05-06 luli sprite添加validtaHandler	 options.onrequirevalidate
 	2009-05-08 luli +hook方法　用于弹层显示隐藏
 	2009-06-04 luli +Form protect
 	2009-8-19 许健  +overcome()
 	2009-09-14 luli +$.sprite
 	2009-09-25 luli +$.fn.notice
 	2009-11-27 luli +dialog宽度自适应
 	2009-11-27 luli +dialog增加submitButton的配置
	2010-02-25 luli 开始重构interactive2,兼容旧的interactive
	2010-09-08 liuwenbo 更改$box结构和定位逻辑.
 */
;(function($){
	
	var __removeBoxtimeoutId = null;
	var __removeErrortimeoutId = null;

    var __box = function(options){
		__remove(options.type);
		options=$.extend({
			title:'',				//框体的标题
			direction:'down',		//框体的弹出方向:up|right|down|left 同时也决定了箭头方向(当然会和窗体弹出方向相反了).
			target:undefined, 		//触发弹框的元素,箭头对齐的目标
			align:'center',			//框体对齐方式:top|right|bottom|left|middle|center
			alignTarget:undefined,	//框体对齐目标,未定义时对齐到target
			noArrow:false,			//不显示箭头 true|false
			noCloser:true,			//不显示关闭
			arrowSize:{a:4,b:11},	//a:箭头尖到框体的距离,b:箭头与框体平行面的长度
			outerFix:{t:0,r:0,b:0,l:0},	//框体outerSize和Size的差别.本期做的框体有4px的border.所以都是4. TODO:自动获取.
			preButtons : false,			//显示确定取消按钮
			roundCorner : true			//添加半透圆角table
		},options);
		if(options.noArrow){
			options.arrowSize={a:0,b:0}
		}
		if(isIE6()){options.roundCorner=false;options.outerFix={t:4,r:4,b:4,l:4}}
		//我们来定义这个弹框吧
        var $box = $('<div></div>').attr('id','jquery-interactive-'+options.type).appendTo(document.getElementById('content')||document.body),
			tmpHTML=(options.noArrow?'':'<em class="interactive-arrow interactive-arrow-'+options.direction+'">^</em>')
					+'<div class="interactive-main">'
					+'<div class="interactive-title">'
					+(options.title?'<h2>' + options.title + '</h2>':'')
					+'<span class="interactive-closed"><a class="interactive-x close_gray" href="javascript:void(0);">关闭</a></span></div>'
					+'<div class="interactive-error"><a href="javascript:void(0);" class="close_gray">关闭</a><div></div></div><div class="interactive-success"><div></div></div><div class="interactive-content">&nbsp;</div>'
					+'<div class="interactive-bottom"><span class="interactive-loading">loading……</span><button class="b-default" type="submit"><span><b>确定</b></span></button>'
					+(options.noCloser?'<button class="b-gray" type="reset"><span><b>取消</b></span></button>':'')+'</div></div>'
					;
		
        $box.attr('class', 'arrowbox').html((options.roundCorner?'<table class="jquery-interactive-wrapper"><colgroup><col width="4px"/><col width="4px"/><col width="4px"/></colgroup><tr><td class="wrapperTL"></td><td class="wrapperTC"></td><td class="wrapperTR"></td></tr><tr><td class="wrapperML"></td><td class="wrapperMC">':'')+'<div class="interactive-wrapper"></div>'+(options.roundCorner?'</td><td class="wrapperMR"></td></tr><tr><td class="wrapperBL"></td><td class="wrapperBC"></td><td class="wrapperBR"></td></tr></table>':''))
		.show()
		.css({
			'zIndex' : 99999
		})
		.find('.interactive-wrapper').html(tmpHTML);
		if(options.noCloser){
			$('a.interactive-x', $box).remove()
		}else{
			$('a.interactive-x', $box).click(function(){
				__remove(options.type);
				return false;
			});
		}
		$('#jquery-interactive-box2 div.interactive-error a').click(function(){
			$(this).parent().hide();
		});
		if(options.mask) $.mask(); 
		//如果指定了top left，那么给box做标记，__resetPos不再重置位置
		if(options.left||options.top)	$box.data('customPosition',true);
		$box.data('options', options);
		__setPos($box);
		//fix IE6 slecte z-index bug
		if(isIE6()){
			$box.wrapInner('<div style="position:relative;"></div');
			var _h = $box.outerHeight();
			$('<iframe id="jquery-interactive-iframe"></iframe>')
			.prependTo($box)
			.height(_h)
			.attr('src','about:blank')
			.css({
				'left': -8,
				'opacity': 0,
				'position': 'absolute',
				'top': -8,
				'width': '100%',
				'zIndex': '-1'
			});
			//fix end
		}
		$box.extend({
			destory:function(){
				__remove(options.type);
			},
			showLoading:__showloading,
			hideLoading:__hideloading,
			showError:__showError,
			cleanError:__cleanError,
			showSuccess:function(msg,callback){
				__showSuccess(msg,callback,$box);
			},
			enableSubmit:__enableSubmit,
			disableSubmit:__disableSubmit
		});
		
		return $box;
    };
    
	//destory Box
	var __remove = function(type){
		//type: mask || box
		//兼容$.alert $.sprite的$.UI.hide();
		if(!type) $('#jquery-interactive-box2, #jquery-interactive-alert, #jquery-interactive-box, #jquery-interactive-notice, #jquery-interactive-alert, #jquery-interactive-errormsg, #jquery-interactive-successmsg').remove();
		else $('#jquery-interactive-errormsg, #jquery-interactive-successmsg, #jquery-interactive-'+type).remove();
		$('#jquery-interactive-mask').remove();
		if($.errormsg.timeoutId)clearTimeout($.errormsg.timeoutId);
		if(__removeBoxtimeoutId) {
			clearTimeout(__removeBoxtimeoutId);
			__removeBoxtimeoutId = null;
		}
	}
	
	//set Pos
	var __setPos = function(box){
		var _box = box || $('#jquery-interactive-box2');
		var _pos = getMidOfClient(_box),
			_arrowpos={x:undefined,y:undefined},
			options= _box.data('options');
		var $alignTarget=$(options.alignTarget||options.target||'body'),
			atOffset=$alignTarget.offset(),
			$target=$(options.target),
			tOffset=$target.offset();
			
		switch(options.align){
			//垂直对齐,对应direction:left|right
			case 'top':
				_pos.y=atOffset.top;
				_arrowpos.y=tOffset.top-_pos.y+($target.outerHeight()-options.arrowSize.b)/2-options.outerFix.t;
				break;
			case 'bottom':
				_pos.y=atOffset.top+$alignTarget.outerHeight()-_box.outerHeight();
				_arrowpos.y=tOffset.top-_pos.y+($target.outerHeight()-options.arrowSize.b)/2-options.outerFix.t;
				break;
			case 'middle':
				_pos.y=atOffset.top-(_box.outerHeight()-$alignTarget.outerHeight())/2;
				_arrowpos.y=tOffset.top-_pos.y+($target.outerHeight()-options.arrowSize.b)/2-options.outerFix.t;
				break;
			//水平对齐,对应direction:up|down
			case 'right':
				_pos.x=atOffset.left+$alignTarget.outerWidth()-_box.outerWidth();
				_arrowpos.x=tOffset.left-_pos.x+($target.outerWidth()-options.arrowSize.b)/2-options.outerFix.r;
				break;
			case 'left':
				_pos.x=atOffset.left;
				_arrowpos.x=tOffset.left-_pos.x+($target.outerWidth()-options.arrowSize.b)/2-options.outerFix.l;
				break;
			case 'center':
				_pos.x=atOffset.left-(_box.outerWidth()-$alignTarget.outerWidth())/2;
				_arrowpos.x=tOffset.left-_pos.x+($target.outerWidth()-options.arrowSize.b)/2-options.outerFix.l;
				break;
		}
		switch(options.direction){
			case 'left':
				_pos.x=tOffset.left-(_box.outerWidth()+options.arrowSize.a);
				break;	
			case 'right':
				_pos.x=tOffset.left+($target.outerWidth()+options.arrowSize.a);
				break;
				
			case 'up':
				_pos.y=tOffset.top-(_box.outerHeight()+options.arrowSize.a);
				break;
			case 'down':
				_pos.y=tOffset.top+($target.outerHeight()+options.arrowSize.a);
				break;
		}
		
		_box.css({
			left : options.left || _pos.x,
			top : options.top || _pos.y
		});
		$('.interactive-arrow',_box).css({
			left : _arrowpos.x,
			top : _arrowpos.y
		});
	}

	//reset Pos 
	var __resetPos = function(box){
		var _box = box || $('#jquery-interactive-box2');
		$('#jquery-interactive-iframe', _box)
		.height(_box.outerHeight())
		.width(_box.outerWidth());
		/*$('.jquery-interactive-wrapper', _box)
		.height(_box.outerHeight())
		.width(_box.outerWidth()+8);*/
		if(_box.data('customPosition'))	return;
		__setPos(_box);
	}
	
	//loading
	function __showloading(){
		__cleanError();
		$('#jquery-interactive-box2 .interactive-loading').css('visibility', 'visible');
	}

	//loaded
	function __hideloading(){
		$('#jquery-interactive-box2 .interactive-loading').css('visibility', 'hidden');
	}
	//disableSubmit
	function __disableSubmit(){
		var $box = $('#jquery-interactive-box2');
		$('button[type=submit]',$box).attr('disabled',true).addClass('disabled');
	}
	//enableSubmit
	function __enableSubmit(){
		var $box = $('#jquery-interactive-box2');
		$('button[type=submit]',$box).attr('disabled',false).removeClass('disabled');
	}
	//showError
	//在弹层中显示错误提示
	function __showError(msg){
		__hideloading();
		var $error = $('.interactive-main div.interactive-error');
		var $main = $('.interactive-main div.interactive-main');
		$error.width($main.width() - 10).show().find('div').html(msg);
	}

	//对于无法在弹层中提示错误的，使用$.alert显示严重错误
	function __showGlobalError(msg){
		__remove();
		$.alert(msg, {title : '错误'})
	}

	//cleanError
	function __cleanError(){
		$('.interactive-main div.interactive-error').hide().find('div').html('');
	}
	
	//showSuccess
	var __showSuccess = function(msg,callback,$box){
		msg=msg||'操作成功';
		__hideloading();
		var $success = $('.interactive-main div.interactive-success');
		var $main = $('div.interactive-main');
		$success.width($main.width() - 20).show().find('div').html('<span class="icon_success">'+msg+'</span>');
		$success.show().appendTo($('.interactive-main div.interactive-content').empty());
		
		if(callback&&callback.constructor == Function){
			__removeBoxtimeoutId=setTimeout((function(){callback.apply($box, arguments);__remove();}),3000);
		}
	}
	
	//检查s是否为一段未被html标签包裹的string.
	var __notHtmlWraped=function(s){
		return (/^[^<]+(<([a-z]+)>[^<]*<\/\2>[^<]*)*$|^<([a-z]+)>[^<]*<\/\3>[^<]+$/i).exec(s.toString()||s)
	}
	 
    var __globalOptions = {
		width:'auto',
		maxWidth:20, //in em
		minWidth:12, //in em
        height: 200,
        title: '',
		mask: false,
		liveTime: null,
        selector: null,
        onComplete: null,
        onabort: null,
        ondone: null,
        onerror: null,
        ontimeout: null,
		animate: 'show',
		type: 'box2'
    };
    
    $.extend({
		/**
		 * Alert
		 * @param {Object} message
		 * @param {Object} options
		 */
        alert: function(message, options){
			var message = message || '';
			var _baseOption = {
				type : 'alert',
				liveTime : '3000',
				preButtons : false,
				direction:null,
				align:null,
				mask:true,
				noArrow:true,
				noCloser:false
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);


			if($.alert.timeoutId)	clearTimeout($.alert.timeoutId);
			//init UI
			var $box = __box(options);
			//在弹层中alert的层级最高
			$box.width(options.width).css('zIndex', 212121888);
			var $content = $box.find('div.interactive-content');
			$content.html(message);
			//如果提示是一行文字，那么算出宽度,右边留出点位置给关闭按钮
			if($.browser.msie&&__notHtmlWraped(message)){
				var tmpWidth=message.replace(/<\/?\w+>/ig,'').length;
				if(options.preButtons)tmpWidth=tmpWidth<options.minWidth?options.minWidth:tmpWidth;
				$content.width(tmpWidth>options.maxWidth?options.maxWidth+'em':tmpWidth+'em');
				if(!options.noCloser){
					$('div.interactive-main', $box).css('padding-right', '44px');
				}
			}
			if(options.preButtons == false){
				$('div.interactive-bottom', $box).remove();
				if(options.liveTime){
					$.alert.timeoutId = setTimeout(function(){
						__remove(options.type);
						if(options.onClose) options.onClose.call($box);
					}, options.liveTime);
				}
			}
			__resetPos($box);
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			$('div.interactive-bottom button', $box).add($('a.interactive-x',$box).unbind('click')).unbind('click').click(function(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
				return false;
			});
			return $box;
        },
		
		notice: function(message, options){
			var message = message || '';
			var _baseOption = {
				type : 'notice',
				liveTime : '3000',
				preButtons : false,
				direction:'right',
				align:'middle',
				mask:false,
				target:undefined //必选
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);


			if($.notice.timeoutId)	clearTimeout($.notice.timeoutId);
			//init UI
			var $box = __box(options);
			//在弹层中alert的层级最高
			$box.width(options.width)
				.css('zIndex', 212121888);
			var $content = $box.find('div.interactive-content');
			$content.html(message);
			//如果提示是一行文字，那么算出宽度,右边留出点位置给关闭按钮
			if($.browser.msie&&__notHtmlWraped(message)){
				var tmpWidth=message.replace(/<\/?\w+>/ig,'').length;
				if(options.preButtons)tmpWidth=tmpWidth<options.minWidth?options.minWidth:tmpWidth;
				$content.width(tmpWidth>options.maxWidth?options.maxWidth+'em':tmpWidth+'em');
				if(!options.noCloser){
					$('div.interactive-main', $box).css('padding-right', '44px');
				}
			}
			if(options.preButtons == false){
				$('div.interactive-bottom', $box).remove();
				if(options.liveTime){
					$.notice.timeoutId = setTimeout(function(){
						__remove(options.type);
						if(options.onClose) options.onClose.call($box);
					}, options.liveTime);
				}
			}
			__resetPos($box);
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			$('div.interactive-bottom button', $box).add($('a.interactive-x',$box).unbind('click')).unbind('click').click(function(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
				return false;
			});
			return $box;
        },
		errormsg: function(message, options){
			var message = message || '';
			var _baseOption = {
				type : 'errormsg',
				liveTime : '5000',
				preButtons : false,
				direction:'right',
				align:'middle',
				mask:false,
				noArrow:false,
				noCloser:true,
				target:undefined, //必选
				arrowSize:{a:6,b:6},
				outerFix:{t:0,r:0,b:0,l:0}
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);

			if($.errormsg.timeoutId)clearTimeout($.errormsg.timeoutId);
			//init UI
			var $box = __box(options);
			//在弹层中alert的层级最高
			$box.width(options.width)
				.css('zIndex', 212121888);
			var $content = $box.find('div.interactive-content');
			$content.html(message);
			//如果提示是一行文字，那么算出宽度,右边留出点位置给关闭按钮
			if($.browser.msie&&__notHtmlWraped(message)){
				var tmpWidth=message.replace(/<\/?\w+>/ig,'').length;
				if(options.preButtons)tmpWidth=tmpWidth<options.minWidth?options.minWidth:tmpWidth;
				$content.width(tmpWidth>options.maxWidth?options.maxWidth+'em':tmpWidth+'em');
				if(!options.noCloser){
					$('div.interactive-main', $box).css('padding-right', '44px');
				}
			}
			if(options.preButtons == false){
				$('div.interactive-bottom', $box).remove();
				if(options.liveTime){
					$.errormsg.timeoutId = setTimeout(function(){
						__remove(options.type);
						if(options.onClose) options.onClose.call($box);
					}, options.liveTime);
				}
			}
			__resetPos($box);
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			$('div.interactive-bottom button', $box).add($('a.interactive-x',$box).unbind('click')).unbind('click').click(function(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
				return false;
			});
			return $box;
        },
		successmsg: function(message, options){
			var message = message || '';
			var _baseOption = {
				type : 'successmsg',
				liveTime : '5000',
				preButtons : false,
				direction:'right',
				align:'middle',
				mask:false,
				noArrow:false,
				noCloser:true,
				target:undefined, //必选
				arrowSize:{a:6,b:6},
				outerFix:{t:0,r:0,b:0,l:0}
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);

			if($.errormsg.timeoutId)clearTimeout($.errormsg.timeoutId);
			//init UI
			var $box = __box(options);
			//在弹层中alert的层级最高
			$box.width(options.width)
				.css('zIndex', 212121888);
			var $content = $box.find('div.interactive-content');
			$content.html(message);
			//如果提示是一行文字，那么算出宽度,右边留出点位置给关闭按钮
			if($.browser.msie&&__notHtmlWraped(message)){
				var tmpWidth=message.replace(/<\/?\w+>/ig,'').length;
				if(options.preButtons)tmpWidth=tmpWidth<options.minWidth?4:tmpWidth;
				$content.width(tmpWidth>options.maxWidth?options.maxWidth+'em':tmpWidth+'em');
				if(!options.noCloser){
					$('div.interactive-main', $box).css('padding-right', '44px');
				}
			}
			if(options.preButtons == false){
				$('div.interactive-bottom', $box).remove();
				if(options.liveTime){
					$.errormsg.timeoutId = setTimeout(function(){
						__remove(options.type);
						if(options.onClose) options.onClose.call($box);
					}, options.liveTime);
				}
			}
			__resetPos($box);
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			$('div.interactive-bottom button', $box).add($('a.interactive-x',$box).unbind('click')).unbind('click').click(function(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
				return false;
			});
			return $box;
        },

        dialog: function(message, options){
			var message = message || '';
			var _baseOption = {
				title : '',
				type : 'box2',
				liveTime : '3000',
				preButtons : false
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);

			//init UI
			var $box = __box(options);
			var $content = $box.find('div.interactive-content');
			
			if (message.constructor == String){
				$content.html(message);				
				//如果提示是一行文字，那么main的上下边距为50px
				if($content.height() < 20){
					$('div.interactive-main', $box).css('padding', '50px 25px');
				};
			}else{
				var _cacheDom = $(message);
				if (!_cacheDom.length) return false;
				$content.html('').append(_cacheDom.children().clone(true));				
			}
			if(options.preButtons == false) $('div.interactive-bottom', $box).remove();
			
			__resetPos($box);
			if(isIE6()){setTimeout((function(){__resetPos($box);}),200)}
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			$('div.interactive-bottom button',$box).add($('a.interactive-x',$box).unbind('click')).unbind('click').click(function(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
				return false;
			});
			$('div.interactive-main', $box).find(':text:first').focus();
			return $box;
        },

        
        confirm: function(message, options){
            var message = message || '确定要进行该操作吗？';
			var _baseOption ={
				noCloser:true,
				type : 'confirm',
				liveTime : '3000',
				preButtons : true,
				direction:null,
				align:null,
				mask:true,
				noArrow:true
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);
			//init UI
			var $box = __box(options);
			$box.width(options.width);
			var $content = $box.find('div.interactive-content');
			$content.html(message);
			//if only some litters，reset width
			if($.browser.msie&&__notHtmlWraped(message)){
				var tmpWidth=message.replace(/<\/?\w+>/ig,'').length;
				if(options.preButtons)tmpWidth=tmpWidth<options.minWidth?options.minWidth:tmpWidth;
				$box.find('div.interactive-content').css('width',tmpWidth>options.maxWidth?options.maxWidth+'em':tmpWidth+'em');
				if(!options.noCloser){
					$('div.interactive-main', $box).css('padding-right', '44px');
				}
			}
			__resetPos($box);
			if(isIE6()){setTimeout((function(){__resetPos($box);}),200)}
			$('div.interactive-bottom button[type=submit]',$box).focus();
			//bindEvent
			function closeBox(){
				__remove(options.type);
				if(options.onClose) options.onClose.call($box);
			}
			$('div.interactive-bottom button[type=submit]',$box).click(function(){
				if (options.onAccept) options.onAccept($box);
				closeBox();
			});
			$('div.interactive-bottom button[type=reset]',$box).click(function(){
				if (options.onCancel) options.onCancel($box);
				closeBox();
			});
			$('a.interactive-x',$box).unbind('click').click(function(){
				if (options.onCancel) options.onCancel($box);
				closeBox();
				return false
			});
			return $box;
        },

		sprite: function(url, options){
			var url  = $.trim(url);
			var _baseOption =  {
				title : '',
				noArrow:false,			//不显示箭头 true|false
				mask:true,
				direction:null,
				align:null,
				dontBind:false			//不要绑定form操作
			};
			//Merge options
			options = $.extend({}, __globalOptions, _baseOption, options);
			//init UI
			var $box = __box(options);
			var $content = $('div.interactive-content', $box);
			var $submit = $('div.interactive-bottom', $box);
			$content.html('<p style="width:'+options.minWidth+'em">载入中，请稍候...</p>');
			$submit.hide();
			__showloading();
			__resetPos($box);
			//is it a remote request?
			var requestMethod = 'ajax';
			var rhost = (/^(\w+:)?\/\/([^\/?#]+)/.exec(url));
			if(rhost){
				rhost = rhost[0];
				var shost = location.protocol + '//' + location.host;
				if(rhost !== shost)	requestMethod = 'swfajax';
			}
			/*防止flash没有载入完毕的时候调用,js出现报错*/
			($[requestMethod]||$.ajax)({
				url : url + '&' + +new Date,
				success : function(r){
					if(r.code){
						//onClose Handler
						if(options.onClose) options.onClose.call($box);
						$.UI.hide();
						$.alert(r.msg);
						return false;
					}
						
					$content.html(r.msg);
					if(options.preButtons == false){
						$submit.remove();
					}
					else{
						$submit.show();
					}
					__resetPos($box);
					
					$('div.interactive-main', $box).find(':text:first').focus();
					//onload Handler
					if(options.onLoad) options.onLoad.call(options.link, $box);
					$('a.interactive-x',$box).unbind('click').click(function(){
						if (options.onCancel) options.onCancel($box);
						__remove(options.type);
						//onClose Handler
						if(options.onClose) options.onClose.call($box);
					});
					__hideloading();
					__resetPos($box);
					if(options.dontBind)return;
					var $form = $('form', $box);
					//由于弹层的确定按钮是统一的，不在form中定义，所以需要触发formSubmit
					$('button[type=submit]',$box).click(function(){
						if (options.onAccept) options.onAccept($box);
						//如果用户设置option.preButtons 为false
						//自己在form中使用submit按钮提交，那么sprite不需要做额外处理
						if(!$(this).parents('form').length) $form.submit();
					});
					//如果form中存在reset按钮，那么绑定关闭弹层功能
					$('button[type=reset]', $box).click(function(){
						if (options.onCancel) options.onCancel($box);
						__remove(options.type);
						//onClose Handler
						if(options.onClose) options.onClose.call($box);
					});
					if($form.attr('action') === '') $form.attr('action', url);
					$form.ajaxForm({
						type : 'POST',
						dataType : 'json',
						beforeSubmit: function(){
							if(options.onBeforeSubmit){
								var result = options.onBeforeSubmit.call(options.link, $box);
								if(!result)	return false;
							}
							__disableSubmit();
							__showloading();
						},
						success : function(r){
							var _code = r.code;
							if(_code == 0){
								__remove(options.type);
								if(options.onComplete)	options.onComplete.call(options.link, $box, r);
								//onClose Handler
								if(options.onClose) options.onClose.call(options.link, $box);
							}
							else{
								__showError(r.msg);
							}
							__enableSubmit();
							__hideloading();
						},
						error : function(){
							__showError('与服务器通讯时出错, 请重试');
							__enableSubmit();
							__hideloading();
						},
						timeout : function(){
							__showError('与服务器的通讯超时, 请重试');
							__enableSubmit();
							__hideloading();
						}
					});
				}
			});
			return false;
		},
        
        mask: function(options){
			var options = $.extend({
				opacity : .2,
				animate : 'show',
				color: '#000000'
			},options);
			//initUI
			__remove('mask');
            var $box = $('<div id="jquery-interactive-mask" style="filter:alpha(opacity='+100*options.opacity+');"></div>').appendTo(document.body);
            $box.addClass('masking')[options.animate]();
			$box.css({
				width : $(window).width(),
				height : $(document).height(),
				opacity : options.opacity,
				backgroundColor : options.color,
				zIndex : 99990
			});
        } // mask
    });
    
	$.fn.extend({
		dialog : function(options){
			var _baseOption =  {
				title : ''
			};
			var $box;
			//Merge options
			options = $.extend(_baseOption, options);
			
			$(this).each(function(){
				//when this is a link.
				if (this.tagName.toUpperCase() == 'A') {
					$(this).click(function(){
						$box = $.dialog($(this).attr('srv')||this.href, options);
						return false;
					});
				}
				else{
					//when this is the pre-display container
					$box = $.dialog(this, options);
				}
			});
			return $box;
		},

		confirm : function(msg, options){
			var _baseOption ={
				direction:'down',
				align:'right',
				mask:false,
				noArrow:false
			};
			var $box;
			//Merge options
			options = $.extend(_baseOption, options);
			
			return this.each(function(){
				options.target=this;
				$box = $.confirm(msg, options);
			})
		},
		
		sprite : function(url,options){
			var _baseOption ={
				direction:'down',
				align:'right',
				mask:false,
				noArrow:false
			};
			var $box;
			//Merge options
			options = $.extend(_baseOption, options);
			
			return this.each(function(){
				options.target=this;
				options.link = $(this);
				$.sprite(url, options);
				return false;
			}); // live
		},
		
		notice : function(msg,options){
			var _baseOption =  {
				liveTime:3000
			};
			var $box;
			//Merge options
			options = $.extend(_baseOption, options);
			
			return this.each(function(){
				options.target=this;
				$box = $.notice(msg, options);
			})
		},
		
		errormsg : function(msg,options){
			var $box;
			//Merge options
			options = $.extend({roundCorner:false}, options);
			
			return this.each(function(){
				options.target=this;
				$box = $.errormsg(msg, options);
			})
		},
		successmsg : function(msg,options){
			var $box;
			//Merge options
			options = $.extend({roundCorner:false}, options);
			
			return this.each(function(){
				options.target=this;
				$box = $.successmsg(msg, options);
			})
		}
	});
	
    //hide
    $['UI'] = $['UI'] || {};
    $['UI']['hide'] = $['UI']['hide'] || __remove;
})(jQuery);

var _debug_=true;
//global Function
function getMidOfClient(el){
	var $el = $(el);
	if (!$el.length) return;
	var _client = $(window);
	var _page = $(document);
	var _pos = {};
	_pos.x = ((_client.width() - $el.outerWidth())/2 + _page.scrollLeft()) >> 0;
	_pos.y = ((_client.height() - $el.outerHeight())/2 + _page.scrollTop()) >> 0;
	return _pos;
}

function isIE6(){
	return ($.browser.version == '6.0') && $.browser.msie;
}
