;
(function($) {
	$.log = function() {
		if (!window.debug && !$.debug)
			return;
		if (window.console && window.console.log) {
			window.console.log(arguments);
		} else {
			if (window.opera && window.opera.postError) {
				window.opera.postError(arguments);
			}
		}
		
	};
	$.servieProxy = function(options) {
		var options = $.extend(options, {
					type : 'GET',
					data : '',
					contentType : "application/json; charset=utf-8",
					dataType:'JSON',
					success : function() {
					},
					error : function() {
						$.log(arguments);
					}
				});
		if (typeof(options.data) == 'object') {
			options.data = $.toJSON(options.data);
		}
		$.ajax(options);
	};

})(jQuery);