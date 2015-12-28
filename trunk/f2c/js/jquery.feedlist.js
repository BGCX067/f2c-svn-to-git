;(function($){
	var feedListCache = {},currentList = null;
	
	function __list(userid,box){
		var container =feedListCache[userid];
		if(!box) box = document.body;
		if(!currentList){
			currentList = $(box).find('div.txt_box:visible');
		}
		if(!container){
			var $c = $('<div class="txt_box" style="display:none" rel="'+userid+'"><div class="history">^^^ View History ^^^</div></div>').appendTo(box);
			$.extend(this.prototype,{swich:__swich});
			container = feedListCache[userid] = $c;
			$c.find('div.history').click();
		};
		return container;	
	}
	function __swich(){
		currentList.hide();
		currentList = $(this).show();
	}
	$.extend({feedlist:__list	});
	$.fn.extend({
		feedlist:function(userid){
			return $.feedlist(userid ,this);
		}

	});
})(jQuery);
