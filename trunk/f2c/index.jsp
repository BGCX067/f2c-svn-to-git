<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:og="http://ogp.me/ns#"
      xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="css/style.css" type="text/css" />
<link rel="stylesheet" href="css/interactive/interactive.css" type="text/css" />
<title>m2you - Send SMS to Chinamobile</title>
<script type="text/javascript" charset="utf-8">
	var url = "${redirect}";
	if(url) top.location = url;
</script>
</head>
<body id="content">
<% /*
<div style="display:none">我的信息：
        <span>ID:${loginUser.id}</span>
        <span>昵称:${loginUser.nickname}</span>
        <span>facebookUID:${loginUser.facebookUID}</span>
        <span>说客ID:${loginUser.mobileUID}</span>
  <br/>
  <c:forEach items="${friendList}" var="friend" varStatus="status">
        <div>好友${status.index + 1}:
          <span>ID:${friend.id}</span>
          <span>备注名:${friend.nickname}</span>
          <span>手机号:${friend.mobile}</span>
          <span>说客ID:${friend.mobileUID}</span>
        </div>
  </c:forEach>
</div>
*/ %>
<div id="maincolumn">
  
  <div class="user_box">
     <div class="namebox clearfix">
	   <img src="http://graph.facebook.com/${loginUser.facebookUID}/picture" />
	   <div class="txt">
	   <p><a href="#">${loginUser.nickname}</a></p>
	   <p title="xxx">1065810397${loginUser.mobileUID}</p>
	   </div>
     </div>
     <div class="sevs">
	   <p><a id="sevs_home" href="javascript:void(0);"><span class="icon_m2you"></span>m2you&nbsp;home</a></p>
	   <p><a id="sevs_addcontact" href="javascript:void(0);"><span class="add"></span>Add&nbsp;contact</a></p>
	   <p><a id="sevs_signature" href="javascript:void(0);"><span class="sign"></span>Edit nickname</a></p>
     </div>
     <div class="invite">
	   <a href="#" id="invite"></a>
	 </div>

	<iframe id="fblikebox"  src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fapps%2Fapplication.php%3Fid%3D159159414143696&amp;width=185&amp;colorscheme=light&amp;show_faces=true&amp;border_color&amp;stream=false&amp;header=true&amp;height=320" scrolling="no" frameborder="0" style="border:none; overflow:hidden;width:185px;height:320px;margin-top:47px; " allowTransparency="true"></iframe>
  </div>
	<div class="contacts home clearfix">
    <div class="hd clearfix">
	  <h2>Contacts</h2>
	  <a id="contacts_add" href="javascript:void(0)" class="add"></a>
	</div>
	<div class="list">
	  <div class="search">
<form id="search" onsubmit="return false;">
	    <input id="search_keyword" name="keyword" type="text" class="i-n" title="search" autocomplete="off"/>
	    <input type="submit" class="search_btn" value="" />
</form>
	  </div>
<% /*

 <c:forEach items="${friendList}" var="friend" varStatus="status">
	    <li id="${friend.id}" mobile="${friend.mobile}" mid="${friend.mobileUID}"><span class="name">${friend.nickname}</span><span class="phone">${friend.mobile}</span><span class="editorname"><a href="javascript:void(0);" title="修改姓名"></a></span></li>
  </c:forEach>
*/ %>
	  <ul id="friendList" class="clearfix loading">
     <li id="{id}" mobile="{mobile}" mid="{mobileUID}"><span class="name">{nickname}</span><span class="phone">{mobile}</span><span class="editorname"><a href="javascript:void(0);" style="{hidden}" title="修改姓名"></a></span></li>
	  </ul>
	</div>
  </div>

<div class="mail_box home" style="visibility:hidden">
	<div id="feedListContainer">
<%/*
	<div class="txt_box">
		<div class="history">^^^ View History ^^^</div>
	  <div class="txt in"><b></b>
		<p><strong>M2you:</strong>You just added  <span class="orange">"Xu Feng"</span>to啊 your contact list. Please inform him to accept your invitation and then send him text messages, or he can not receive text messages you send.啊</p>
		<p><span class="gray">10:41 PM</span></p>
	  </div>

	  <div class="txt out"><b></b>
	    <p><strong>Me:</strong>You just added  <span class="orange">"Xu Feng"</span>to啊 your contact list. Please inform him to accept your invitation and then send him text messages, or he can not receive text messages you send.啊</p>
		<p><span class="gray">10:41 PM</span></p>
	  </div>

	  <div class="txt sending"><b></b>
	    <p><strong>M2you:</strong>You just added  <span class="orange">"Xu Feng"</span>to啊 your contact list. Please inform him to accept your invitation and then send him text messages, or he can not receive text messages you send.啊</p>
		<p><span class="gray">10:41 PM</span></p>
	  </div>
	</div>
*/%>
	</div>
	<form id="editor_form" action="msg/send.json" method="post">
	<div class="editor_box clearfix">
		<h3>To: <span class="sendto_nickname"></span></h3>
	  <input id="editor_sendto" name="friend_id" type="hidden" autocomplete="off"/>
	  <textarea rows="" cols="" id="editor" class="" name="text" resizable="false"></textarea>
	  <div class="op">
	    <input type="submit" class="btn_send" value="" id="editor_submit" name="button">
	    <p id="editor_limit">140<p>
	  </div>
	</div>
	</form>
  </div>
  <div class="signature" style="display:none">
    <h2>Edit nickname</h2>
    <p>last update: <span class="nickname">${loginUser.nickname}</span></p>
	<form id="signature_form" action="u/update.json" method="post">
		<textarea name="nickname"></textarea>
		<input type="submit" class="btn_ok" value=""/>
	</form>
  </div>

<div id="addfriend_form_holeder" style="display:none">
<div>
<div id="addfriend_form" class="layer_add">
   <h2>name</h2>
   <p><input name="" class="i-n" type="text" /></p>
   <h2>china mobile number</h2>
   <p><input name="" class="i-n" type="text" /></p>
   <p><a href="#" class="btn_add"></a><a href="#" class="btn_cancel"></a></p>
</div>
</div>
</div>
</div>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.iprompt.js"></script>
<script type="text/javascript" src="js/jquery.ieffect.js"></script>
<script type="text/javascript" src="js/jquery.textbox.js"></script>
<script type="text/javascript" src="js/jquery.interactive.js"></script>
<script type="text/javascript" src="js/jquery.pubsub.js"></script>
<script type="text/javascript" src="js/formater.js"></script>
<script type="text/javascript" src="js/jquery.searchlist.js"></script>
<script type="text/javascript" src="js/jquery.feedlist.js"></script>
<script type="text/javascript" src="js/m2c.js"></script>
<script type="text/javascript">
var friendListData =${friendListJson}; 
var ME={
        id:'${loginUser.id}',
        nickname:'${loginUser.nickname}',
        facebookUID:'${loginUser.facebookUID}',
        mobileUID:'${loginUser.mobileUID}'
}
</script>
<div id="fb-root"></div>
<script type="text/javascript">
window.fbAsyncInit = function() {
	FB.init({
	    appId  : '${facebook_api_id}',
	    status : true, // check login status
	    cookie : true, // enable cookies to allow the server to access the session
		xfbml  : false  // parse XFBML
	});
	$('#invite').click(function(){
		FB.ui({
				method: 'apprequests',
				message: 'Thanks to M2you, now I can send and receive free SMS directly from Facebook to China! Thought I would invite you to give it a try.',
				data: 'lb'
			});
		return false;
	});
};
</script>
<script src="http://connect.facebook.net/en_US/all.js"></script>

</body>
</html>
