;
(function($) {
	var __acPatten=/ac_[A-z]+/g;
	$('#content').click(function(e) {
		//permission denied to access property 'className' from a non-chrome context(ff3.5 bug). so we try.
		try {
			var target = e.target || e.srcElement || e.originalTarget,
			actions = __getActions(target.className),
			key = 0;
			
			if (!actions.length && '_abutton'.indexOf(target.parentNode.nodeName)) {
				target = target.parentNode;
				actions = __getActions(target.className);
			}
			
			if(ENVOBJ.hotmap&&actions[0]){
				$.publish('track', target, actions.join(','), e);
			}
			//frist item in actions[] is not useable.we send the other ones as event name.
			while (actions[key]){
				$.publish('click_' + actions[key++], target, e);
			}
		} catch(e) {
			return false;
		}
	});
	function __getActions(actions){
		var tmp=actions.match(__acPatten);
		if(tmp&&tmp.length)
			return tmp.join(',').replace('ac_','').split(',');
		else
			return [];
	}
})(jQuery);

;
(function($) { //tracking
	$.subscribe('track' , __tracking, false);
	
	var _serverPath = 'http://120.132.134.44/hotmap.gif';
	var bi_img = new Image();
	
	function __tracking(target,actions,e){
		var actions=actions.split(','),key=0,className='';
		while (actions[key]){
			className='.ac_'+actions[key++];
			var _bi_url = _serverPath 
					+'?doms='+className 
					+':eq('+$(className).index(target)+')'
					+'&m='+Math.random()
					+'&hotmap='+ENVOBJ.hotmap
					+'&uid='+ENVOBJ.curUser.id;
			bi_img.src = _bi_url;
		}
	}
})(jQuery);