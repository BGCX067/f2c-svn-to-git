<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Welcome </title>
<link rel="stylesheet" href="css/style.css" type="text/css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript">
function shownext(){
	$.getJSON('u/register.json',function(r){
		if(r.code == 0){
			var str = '1065810397'+r.data.mobileUID;
			var temp = "";
			for(var i in str){
				if(i%4==0) temp +=" "	
				temp += str[i];
			}
			$('.username').html(r.data.nickname);
			$('#step2 .f20').html($.trim(temp));
			$('#step1').hide().next().show();
		}else{
			alert(r.msg);
			location.reload();
		}
	});
}
</script>
</head>
<body>
<div id="maincolumn">
    <div class="m2you"></div>
	<div id="step1">
    <div class="starbox">
        <div class="cm"></div>
        <p class="star"><a href="javascript:void(0)" onclick="shownext()" class="b-star"></a></p>
        <div class="m2youtext">
            <p>from m2you to China Mobile，Free now!</p>
            <p>You friends replay,Greatly save your SMS costs to communicate with Chinese friends!</p>
        </div>
    </div>
    <div class="likebox" style="display:none">
        1,697 people like this.Be the first of your friends.
        <a class="like floatleft">&nbsp;</a>
        <span class="f floatleft">&nbsp;</span>
    </div>
	</div>
	<div id="step2" style="display:none">
    <div class="starbox noimg">
        <div class="thankbox clearfix">
            <p class="title"><img src="images/test_tx.jpg" align="absmiddle" />HI,<span class="username"></span>, thank you for...</p>
            <p>We palalalalala ...The  SMS channel number you gotten is:</p>
            <p class="f20">1065 8103 97${loginUser.mobileUID}</p>
            <p class="gray">Later, you can tell your chinese friends the number.</p>
			<p><a href="index.action" class="a_send"></a></p>
        </div>
        <div class="m2youtext">
            <p>from m2you to China Mobile，Free now!</p>
            <p>You friends replay,Greatly save your SMS costs to communicate with Chinese friends!</p>
        </div>
    </div>
    </div>
</div>
</body>
</html>
