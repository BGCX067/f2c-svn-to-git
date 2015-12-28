$(function(){
	$.ajaxSetup({
		scriptCharset:'utf-8',
		contentType:'application/x-www-form-urlencoded; charset=UTF-8',
		timeout:35000
	});
	var $editor=$('#editor'),
	$editorForm=$('#editor_form'),
	$limit=$('#editor_limit'),
	$btnSubmit=$('#editor_submit'),
	$sendTo=$('#editor_sendto'),
	$sendToNickname=$('.sendto_nickname'),
	$friendList=$('#friendList')
	$feedContainer = $('#feedListContainer');
function __sevs(name){
	$('div.home,div.signature').hide();
	$('div.'+name).show();
}
function __getFormData(form){
	var o={};
	if(!form&&form.elements)return o;
	for(var i in form.elements){
		if(form.elements[i]&&form.elements[i].name)
			o[form.elements[i].name] = form.elements[i].value;
	}
	return o;
}
// home ------------------------------------------------
	$('#sevs_home').click(function(){
		__sevs('home');
	});

	
// Editor ------------------------------------------------
	$editor.disable = function(){
		$editor.attr('readonly','readonly').blur();
		$btnSubmit.attr('disabled','disabled');
	}
	$editor.enable = function(){
		$editor.attr('readonly',false).focus();
                $btnSubmit.attr('disabled',false);
	}
	$editorForm.submit(function(){
		var o = __getFormData(this);

		if(!o.text||!o.friend_id)return false;
		var myMsg=new Msg({
			type:'out',
			sending:true,
			creatTime:undefined,
			userId:o.friend_id,
			text:o.text
		});	
		myMsg.render();
		$editor.disable();

		$.post(this.action,o,function(r){
			$editor.enable();
			if(r.code){
				$editor.enable();
				myMsg.ele.remove();
				return;
			}
			$editor.val('');
			myMsg.ele.removeClass('sending').addClass('out').attr('feedid',r.data.feedId);
			delete myMsg;
		});
		return false;
	});

	$editor.textbox({
		maxLength: 140,
	        overWrite:true,
        	onInput: function(event, status) {
            		str =  (status.leftLength>=0)?status.leftLength:"<font color='red'>超出"+ (-status.leftLength) + '字</font>';
            		$limit.html(str);
        	}       
	})      
	.iEffect({
            mouseover: "focus",
            focus: "click"
        })
	.keypress(function(e){
       		if(e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10)) {
        	    	e.preventDefault();
            		$editorForm.submit();
        	}       
   	}).keyup();
	
// Seacher ------------------------------------------------
	var $searchList = $('#friendList').searchList();
	$searchList.create(friendListData);
	var $searchForm = $('#search'), $searchKeyword = $('#search_keyword'), __searchTimer;
	$searchForm.submit(function(){
		if(__searchTimer)clearTimeout(__searchTimer);
		__doSearch($searchKeyword.val());
		return false;
	});
	$searchKeyword.iPrompt({refer:'title'})
	.keyup(function(e){
		if(__searchTimer)clearTimeout(__searchTimer);
		__searchTimer=setTimeout((function(){__doSearch(e.target.value)}),500);
	});
	
	function __doSearch(keyword){
		$searchList.search(keyword);
	}
	
// FriendList ------------------------------------------------
	$friendList.click(function(e){
		var target = e.target || e.srcElement || e.originalTarget;
		if(target.parentNode.tagName.toLowerCase()=='li'){target=target.parentNode;}
		else if(target.tagName.toLowerCase()=='a'){ //修改联系人
			__editFriend($(target).closest('li').attr('id'));
			return;
		}
		if(target.tagName.toLowerCase()=='li'){
			$friendList.find('.current').removeClass('current').end().find('.new').removeClass('new');
			__showMsgList($(target).addClass('current').attr('id'));
		}
	});
	function __editFriend(fid){
		__getAddForm({
			action:'update',
			target:null,
			direction:null,
			align:null,
			mask:true,
			fid:fid,
			nickname:$searchList.user(fid).nickname
		});

	}
	function __showMsgList(fid){
		$searchList.find('#'+fid).removeClass('new');
		$feedContainer.feedlist(fid).swich();
		$('.mail_box').css('visibility','visible');
		$sendTo.val(fid);
		$sendToNickname.html($searchList.user(fid).nickname);
	}

// Msg ------------------------------------------------
var TIMEZONEOFFSET=(new Date()).getTimezoneOffset();
function __formatDate(date){
	var tmpDate=new Date(date-TIMEZONEOFFSET);
	return tmpDate.toTimeString().split(' ')[0];
}
var __msgTemplate='<div class="txt {type}" feedid="{feedId}"><b></b><p><strong>{nickName}:</strong>{text}</p><p><span class="gray">{creatTime}</span></p></div>';
var __msgFormater=new Formater(__msgTemplate);
function Msg(o){
	var setting={
		type:'out',
		sending:false,
		creatTime:__formatDate(new Date()),
		feedId:'',
		userId:'',
		nickName:'',
		text:''
	}
	this.ele=undefined;
	if(o.creatTime)o.creatTime = __formatDate(o.creatTime);
	if(o.type=='in'){
		o.nickName=$searchList.user(o.userId).nickname;
	}else{
		//o.nickName=ME.nickname;
		o.nickName='Me';
	}
	return $.extend(this,$.extend(setting,o));
}
$.extend(Msg.prototype,{
	render:function(prev){
		this.ele=$(__msgFormater.exec(this));
		if(this.sending)this.ele.removeClass(this.type).addClass('sending');
		var $txtbox = $feedContainer.feedlist(this.userId);
		$txtbox[prev?'prepend':'append'](this.ele)
		if(!prev)$txtbox.scrollTop($txtbox.scrollTop()+500);
	}
});
var __historyCount=3;
function __history(target){
	var fid=$(target.parentNode).attr('rel')
	var $t=$(target).css('visibility','hidden');
	var $p=$t.parent();
	$.post('msg/history.json',{
			'count':__historyCount,
			'friend_id':fid,
			'max_id':$p.find('.txt:first').attr('feedid')||''
		},function(r){
			if(r.data&&r.data.length){
				var msgs=r.data;//.reverse();
				for(var i in msgs){
					var myMsg=new Msg(msgs[i]);
					myMsg.render('prev');
					delete myMsg;
				}
				if(r.data.length<__historyCount){
					$t.remove();
				}else{
					$t.prependTo($p).show().css('visibility','visible');
				}
			
			}
		}
	);
}

$feedContainer.click(function(e){
	var target = e.target || e.srcElement || e.originalTarget;
	if(target.className == "history"){
		__history(target);
	}
});

// signature ------------------------------------------------
	$('#sevs_signature').click(function(){
		__sevs('signature');
	});

	var $signatureForm = $('#signature_form').submit(function(){
		var o = __getFormData(this);
		if(!o.nickname)return false;
		$.post(this.action,o,function(r){
			if(r.code==0){
				ME=r.data;
				$('.nickname').html(ME.nickname)
			}
		});
		return false;
	});
	
// fetchMsg ------------------------------------------------
	var __fetchTimeout;
	function __fetchMsg(){
		if(__fetchTimeout)clearTimeout(__fetchTimeout);
		$.ajax({
			url:'msg/latest.json',
			method:'POST',
			success:function(r){
				if(r.data&&r.data.length)__parseMsg(r.data);
			},
			complete:function(){
				__fetchTimeout=setTimeout(__fetchMsg,40*1000);
			}
		});
	}

	function __parseMsg(msgs){
		msgs=msgs.reverse();
		for(var key in msgs){
			var myMsg=new Msg(msgs[key]);
			myMsg.render();
			$searchList.find('#'+myMsg.userId).addClass('new').prependTo($searchList);
			delete myMsg;
		}
	}
// add friend ------------------------------------------------
$('#sevs_addcontact').click(function(){
	__getAddForm({
		action:'add',
		target:this,
		direction:'right',
		align:'top',
		alignTarget:$('.sevs')[0]
	});
});
$('#contacts_add').click(function(){
	__getAddForm({
		action:'add',
		target:this,
		direction:'down',
		align:'right',
		alignTarget:$('.contacts')[0]
	});
});
function __getAddForm(option){
	var option=$.extend({
		mask:false,
		noArrow:false,
		preButtons:false	
	},option);
	var $box=$.dialog('<form action="'
		+(option.action=='add'?'f/add.json':'f/update.json')
		+'"><div id="addfriend_form" class="layer_add"><h2>name</h2><p><input name="'
		+(option.action=='add'?'nickname':'f_name')
		+'" class="i-n" type="text" value="'
		+(option.nickname||'')
		+'" /></p>'
		+(option.action=='add'?'<h2>china mobile number</h2><p><input name="mobile" class="i-n" type="text" /></p>':'<input type="hidden" name="f_id" value="'+option.fid+'"/>')
		+'<p><button class="btn_add" type="submit"></button><button class="btn_cancel" type="reset"></button></p></div></form>',option);
	$box.find('form').submit(function(){
			var o = __getFormData(this),regCM=/^1((3[4-9])|4([7])|(5[0-27-9])|8[278])[0-9]{8}$/;
			
			if(!o.nickname&&!o.f_name){
				$box.showError("Contact's name is required");
                                return false;
			}
			if(option.action=='add'&&!regCM.test(o.mobile)){
				$box.showError('Accept only ChinaMobile numbers');
				return false;
			}

			$.post(this.action,o,function(r){
				if(r.code==0){
					$searchList[(option.action=="add"?'create':'update')](r.data);
					$.UI.hide();
					__fetchMsg();
				}else{
					$box.showError(r.msg);
				}
			});

			return false;
		});
	$box.find('.btn_cancel').click(function(){
		$.UI.hide();
	});

}
// do after everthing's done ------------------------------------------------
	$(document).ready(function(){
		__fetchMsg();
		$friendList.find('li:first').click();
	});
});
