;
var Formater = function(template, patten) {
	this.template = template;
	this.patten = patten || /{([^{}]+)}/gm;
	this.Store = [];
	this.data = {};
	var me = this;
	var struct = function(str) {
		this.str = str;
		this.toString = function() {
			return me.data[this.str] || "";
		}
	}

	this.exec = function(collection) {
		this.data = collection || {};
		return this.Store.join("");
	},
	this.build = function(newTemplate, newPatten) {
		if (newTemplate) {
			this.template = newTemplate;
		}
		if (newPatten) {
			this.patten = newPatten;
		}
		if (this.template) {
			this.Store.length = 0;
			var list = this.template.split(this.patten);
			var matches = this.template.match(this.patten);
			if (list.length - matches.length <= 1) {
				var temp = [];
				for (var i = 0, length = list.length; i < length; i++) {
					temp.push(list[i]);
					if (matches[i]) {
						temp.push(matches[i].replace(this.patten, '$1'));
					}
				}
				list = temp;
			}
			for (var i = 0, length = list.length; i < length; i++) {
				var item = list[i];
				if (i % 2 == 1) {
					item = new struct(item);
				}
				this.Store.push(item);
			}
		}
	}

	this.build();
};

