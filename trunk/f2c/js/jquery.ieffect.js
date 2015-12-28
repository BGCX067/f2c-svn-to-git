/*
 * Interactive effect plugin, made by Lewis <mailto: lzlhero@gmail.com>
 */
;(function($) {
$.fn.iEffect = function(settings) {
	var defaults = {
	};

	// give settings to UI elements
	var opts = $.extend(defaults, settings);

	return this.each(function() {
		var $this = $(this);

		// handle default event
		$this.addClass("i-effect")
		.bind("normal", function() {
			var classes = $.trim([opts.error].join(" "));
			if (classes) {
				$this.removeClass(classes);
			}
		});

		// handle mouseover event
		if (opts.mouseover) {
			$this
			.hover(
				function(event) {
					$this.addClass(opts.mouseover);
				},
				function(event) {
					$this.removeClass(opts.mouseover);
				}
			);
		}

		// handle mousedown event
		if (opts.mousedown) {
			// make elements unselectable
			$this
			.css("-moz-user-select", "none")
			.bind("selectstart", function() {
				return false;
			})
			.find("*")
			.attr("unselectable", "on");

			// bind event
			$this
			.mousedown(function(event) {
				$this.data("mousedown", true);
				$this.addClass(opts.mousedown);
			})
			.bind("i-effect-mouseup", function(event) {
				$this.data("mousedown", false);
				$this.removeClass(opts.mousedown);
			})
			.hover(
				function(event) {
					if ($this.data("mousedown")) {
						$this.addClass(opts.mousedown);
					}
				},
				function(event) {
					if ($this.data("mousedown")) {
						$this.removeClass(opts.mousedown);
					}
				}
			);
		}

		// handle foucs event
		if (opts.focus) {
			$this
			.focus(function(event) {
				$this.addClass(opts.focus);
			})
			.blur(function(evnet) {
				$this.removeClass(opts.focus);
			});
		}

		// handle error event
		if (opts.error) {
			$this
			.bind("error", function(event) {
				$this.addClass(opts.error);
			});
		}
	});
};

// tricky: document to handle mouse up event
$(document).mouseup(function() {
	$(".i-effect").trigger("i-effect-mouseup");
});
})(jQuery);