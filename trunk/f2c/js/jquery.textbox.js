/*
 * I think it can work for Chinese Users.
 * Lewis Lv lzlhero@gmail.com
 */

;(function($) {
$.fn.textbox = function(settings) {
	var defaults = {
		maxLength: -1,
		onInput: null,
		_pasteHandler: function(event) {
			var textarea = this;
			window.setTimeout(function() {
				inputHandler.call(textarea, event);
			}, 0);
		},
		_cutHandler: function(event) {
			var textarea = this;
			window.setTimeout(function() {
				inputHandler.call(textarea, event);
			}, 0);
		},
		_keyupHandler: function(event) {
			if (opts.maxLength < 0) {
				if ($.isFunction(opts.onInput)) {
					opts.onInput.call(this, event, {maxLength: opts.maxLength, leftLength: -1});
				}
			}
			else {
				inputHandler.call(this, event);
			}
		},
		_blurHandler: function(event) {
			fixLength(this);
		},
		overWrite:false
	};
	var opts = $.extend(defaults, settings);
	var rg_sideSN=/^[\s\n]+|[\s\n]+$/g;

	// This is the prefect get caret position function.
	// You can use it cross browsers.
	function getInsertPos(textbox) {
		var iPos = 0;
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			iPos = textbox.selectionStart;
		}
		else if (document.selection) {
			textbox.focus();
			var range = document.selection.createRange();
			var rangeCopy = range.duplicate();
			rangeCopy.moveToElementText(textbox);
			while (range.compareEndPoints("StartToStart", rangeCopy) > 0) {
				range.moveStart("character", -1);
				iPos++;
			}
		}
		return iPos;
	}

	// This is the prefect set caret position function.
	// You can use it cross browsers.
	function setInsertPos(textbox, iPos) {
		textbox.focus();
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			textbox.selectionStart = iPos;
			textbox.selectionEnd = iPos;
		}
		else if (document.selection) {
			var range = textbox.createTextRange();
			range.moveStart("character", iPos);
			range.collapse(true);
			range.select();
		}
	}

	function isGreateMaxLength(strValue, strDelete) {
		if (opts.maxLength > 0) {
			return getLength(strValue) - (strDelete ? getLength(strDelete) : 0) > opts.maxLength;
		}
		else {
			return false;
		}
	}

	function fixLength(textbox) {
		if (opts.maxLength > 0) {
			var strValue = textbox.value.replace(rg_sideSN, "");
			if (isGreateMaxLength(strValue)) {
				textbox.value = strValue.substr(0, opts.maxLength);
			}
		}
	}
	
	var rg_ascWords=/[\u0020-\u007E\n]/g;
	function inputHandler(event) {
		if(opts.overWrite){
			if ($.isFunction(opts.onInput)) {
				// callback for input handler
				var fixedLength=getLength(this.value);
				opts.onInput.call(this, event, {
					maxLength: opts.maxLength,
					leftLength: opts.maxLength-fixedLength
				});
			}
		}else{
			var strValue = this.value.replace(rg_sideSN, "");
			if (isGreateMaxLength(strValue)) {
				var scrollTop = this.scrollTop;
				var iInsertToStartLength = getInsertPos(this) - (strValue.length - opts.maxLength);
				this.value = strValue.substr(0, iInsertToStartLength) + strValue.substr(getInsertPos(this));
				setInsertPos(this, iInsertToStartLength);
				this.scrollTop = scrollTop;
			}
			if ($.isFunction(opts.onInput)) {
				// callback for input handler
				opts.onInput.call(this, event, {
					maxLength: opts.maxLength,
					leftLength: opts.maxLength - getLength(this.value)
				});
			}
		}

	};
	
	function getLength(text){
		if(opts.overWrite){
			var cleanValue=text.replace(rg_sideSN, "");
			var ascWord=cleanValue.match(rg_ascWords);
			return cleanValue.length-(ascWord?parseInt(ascWord.length/2+0.5):0);
		}else{
			return text.replace(rg_sideSN, "").length
		}
	}
	

	function getSelectedText(textbox) {
		var strText = "";
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			strText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
		}
		else {
			strText = document.selection.createRange().text;
		}
		return strText.replace(rg_sideSN, "");
	}

	function unbindEvents(textbox, opts) {
		$(textbox)
				.unbind("paste", opts._pasteHandler)
				.unbind("cut", opts._cutHandler)
				.unbind("keyup", opts._keyupHandler)
		if(!opts.overWrite){
			$(textbox).unbind("blur", opts._blurHandler);
		}
	}

	function bindEvents(textbox, opts) {
		var $textbox = $(textbox);

		if (opts.maxLength < 0) {
			$textbox.bind("keyup", opts._keyupHandler);
		}
		else {
			$textbox
					.bind("paste", opts._pasteHandler)
					.bind("cut", opts._cutHandler)
					.bind("keyup", opts._keyupHandler);
			if(!opts.overWrite){
				$(textbox).bind("blur", opts._blurHandler);
				fixLength(textbox);
			}
		}
	}

	this.maxLength = function(maxLength) {
		if (maxLength) {
			opts.maxLength = maxLength;
			return this.filter("textarea").each(function() {
				unbindEvents(this, $(this).data("textbox-opts"));
				$(this).data("textbox-opts", opts);
				bindEvents(this, opts);
			}).end();
		}
		else {
			return opts.maxLength;
		}
	};

	this.input = function(callback) {
		if ($.isFunction(callback)) {
			opts.onInput = callback;
			return this.filter("textarea").each(function() {
				$(this).data("textbox-opts", opts);
			}).end();
		}

		return this;
	};

	this.fixLength = function() {
		return this.filter("textarea").each(function() {
			fixLength(this);
		}).end();
	};

	this.insertText = function(strText) {
		strText = strText.replace(rg_sideSN, "");
		return this.filter("textarea").each(function() {
			if (!isGreateMaxLength(this.value + strText, getSelectedText(this))) {
				if (this.selectionStart || this.selectionStart == "0") {
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;

					this.value = this.value.substring(0, startPos) + 
								strText + this.value.substring(endPos, this.value.length);
					this.focus();

					var cPos = startPos + strText.length;
					this.selectionStart = cPos;
					this.selectionEnd = cPos;
					this.scrollTop = scrollTop;
				}
				else if (document.selection) {
					this.focus();
					var range = document.selection.createRange();
					range.text = strText;
					range.collapse(true);
					range.select();
				}

				// fired when insert text has finished
				inputHandler.call(this);
			}
		}).end();
	};
	this.setInsertPos=function(iPos){
		return this.filter("textarea").each(function() {
			setInsertPos(this, iPos);
		})
	}
	this.getLength=function(){
		return getLength(this.val())
	}
	var selectText = function(nStart, nEnd) {
		return this.filter("textarea").each(function() {
			this.focus();
			if (!ds) {
				this.setSelectionRange(nStart, nEnd);
				return
			}
			var c = this.createTextRange();
			c.collapse(1);
			c.moveStart("character", nStart);
			c.moveEnd("character", nEnd - nStart);
			c.select()
		})
	};

	return this.filter("textarea").each(function() {
		var $textbox = $(this);

		if (settings) {
			if ($.isEmptyObject($textbox.data("textbox-opts"))) {
				$textbox.data("textbox-opts", opts);
				bindEvents(this, opts);
			}
			else {
				unbindEvents(this, $textbox.data("textbox-opts"));
				$textbox.data("textbox-opts", opts);
				bindEvents(this, opts);
			}
		}
		else {
			if (!$.isEmptyObject($textbox.data("textbox-opts"))) {
				opts = $textbox.data("textbox-opts");
			}
		}
		$.extend(this.prototype,{
			selectText:function(nStart, nEnd) {
				return this.filter("textarea").each(function() {
					this.focus();
					if (!ds) {
						this.setSelectionRange(nStart, nEnd);
						return
					}
					var c = this.createTextRange();
					c.collapse(1);
					c.moveStart("character", nStart);
					c.moveEnd("character", nEnd - nStart);
					c.select()
				})
			}
		});
	}).end();
};
})(jQuery);
