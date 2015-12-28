(function(f) {
	var b = null;
	var k = null;
	var g = function(s) {
		m(s.type);
		s = f.extend({
			title : "",
			direction : "down",
			target : undefined,
			align : "center",
			alignTarget : undefined,
			noArrow : false,
			noCloser : true,
			arrowSize : {
				a : 4,
				b : 11
			},
			outerFix : {
				t : 0,
				r : 0,
				b : 0,
				l : 0
			},
			preButtons : false,
			roundCorner : true
		}, s);
		if (s.noArrow) {
			s.arrowSize = {
				a : 0,
				b : 0
			}
		}
		if (isIE6()) {
			s.roundCorner = false;
			s.outerFix = {
				t : 4,
				r : 4,
				b : 4,
				l : 4
			}
		}
		var u = f("<div></div>").attr("id", "jquery-interactive-" + s.type)
				.appendTo(document.getElementById("content") || document.body), r = (s.noArrow ? ""
				: '<em class="interactive-arrow interactive-arrow-'
						+ s.direction + '">^</em>')
				+ '<div class="interactive-main"><div class="interactive-title">'
				+ (s.title ? "<h2>" + s.title + "</h2>" : "")
				+ '<span class="interactive-closed"><a class="interactive-x close_gray" href="javascript:void(0);">å…³é—­</a></span></div><div class="interactive-error"><a href="javascript:void(0);" class="close_gray">å…³é—­</a><div></div></div><div class="interactive-success"><div></div></div><div class="interactive-content">&nbsp;</div><div class="interactive-bottom"><span class="interactive-loading">loadingâ€¦â€¦</span><button class="b-default" type="submit"><span><b>ç¡®å®š</b></span></button>'
				+ (s.noCloser ? '<button class="b-gray" type="reset"><span><b>å–æ¶ˆ</b></span></button>'
						: "") + "</div></div>";
		u
				.attr("class", "arrowbox")
				.html(
						(s.roundCorner ? '<table class="jquery-interactive-wrapper"><colgroup><col width="4px"/><col width="4px"/><col width="4px"/></colgroup><tr><td class="wrapperTL"></td><td class="wrapperTC"></td><td class="wrapperTR"></td></tr><tr><td class="wrapperML"></td><td class="wrapperMC">'
								: "")
								+ '<div class="interactive-wrapper"></div>'
								+ (s.roundCorner ? '</td><td class="wrapperMR"></td></tr><tr><td class="wrapperBL"></td><td class="wrapperBC"></td><td class="wrapperBR"></td></tr></table>'
										: "")).show().css({
					zIndex : 99999
				}).find(".interactive-wrapper").html(r);
		if (s.noCloser) {
			f("a.interactive-x", u).remove()
		} else {
			f("a.interactive-x", u).click(function() {
				m(s.type);
				return false
			})
		}
		f("#jquery-interactive-box2 div.interactive-error a").click(function() {
			f(this).parent().hide()
		});
		if (s.mask) {
			f.mask()
		}
		if (s.left || s.top) {
			u.data("customPosition", true)
		}
		u.data("options", s);
		e(u);
		if (isIE6()) {
			u.wrapInner('<div style="position:relative;"></div');
			var t = u.outerHeight();
			f('<iframe id="jquery-interactive-iframe"></iframe>').prependTo(u)
					.height(t).attr("src", "about:blank").css({
						left : -8,
						opacity : 0,
						position : "absolute",
						top : -8,
						width : "100%",
						zIndex : "-1"
					})
		}
		u.extend({
			destory : function() {
				m(s.type)
			},
			showLoading : l,
			hideLoading : h,
			showError : d,
			cleanError : c,
			showSuccess : function(v, w) {
				q(v, w, u)
			},
			enableSubmit : i,
			disableSubmit : o
		});
		return u
	};
	var m = function(r) {
		if (!r) {
			f(
					"#jquery-interactive-box2, #jquery-interactive-alert, #jquery-interactive-box, #jquery-interactive-notice, #jquery-interactive-alert, #jquery-interactive-errormsg, #jquery-interactive-successmsg")
					.remove()
		} else {
			f(
					"#jquery-interactive-errormsg, #jquery-interactive-successmsg, #jquery-interactive-"
							+ r).remove()
		}
		f("#jquery-interactive-mask").remove();
		if (f.errormsg.timeoutId) {
			clearTimeout(f.errormsg.timeoutId)
		}
		if (b) {
			clearTimeout(b);
			b = null
		}
	};
	var e = function(t) {
		var w = t || f("#jquery-interactive-box2");
		var x = getMidOfClient(w), u = {
			x : undefined,
			y : undefined
		}, y = w.data("options");
		var r = f(y.alignTarget || y.target || "body"), z = r.offset(), s = f(y.target), v = s
				.offset();
		switch (y.align) {
		case "top":
			x.y = z.top;
			u.y = v.top - x.y + (s.outerHeight() - y.arrowSize.b) / 2
					- y.outerFix.t;
			break;
		case "bottom":
			x.y = z.top + r.outerHeight() - w.outerHeight();
			u.y = v.top - x.y + (s.outerHeight() - y.arrowSize.b) / 2
					- y.outerFix.t;
			break;
		case "middle":
			x.y = z.top - (w.outerHeight() - r.outerHeight()) / 2;
			u.y = v.top - x.y + (s.outerHeight() - y.arrowSize.b) / 2
					- y.outerFix.t;
			break;
		case "right":
			x.x = z.left + r.outerWidth() - w.outerWidth();
			u.x = v.left - x.x + (s.outerWidth() - y.arrowSize.b) / 2
					- y.outerFix.r;
			break;
		case "left":
			x.x = z.left;
			u.x = v.left - x.x + (s.outerWidth() - y.arrowSize.b) / 2
					- y.outerFix.l;
			break;
		case "center":
			x.x = z.left - (w.outerWidth() - r.outerWidth()) / 2;
			u.x = v.left - x.x + (s.outerWidth() - y.arrowSize.b) / 2
					- y.outerFix.l;
			break
		}
		switch (y.direction) {
		case "left":
			x.x = v.left - (w.outerWidth() + y.arrowSize.a);
			break;
		case "right":
			x.x = v.left + (s.outerWidth() + y.arrowSize.a);
			break;
		case "up":
			x.y = v.top - (w.outerHeight() + y.arrowSize.a);
			break;
		case "down":
			x.y = v.top + (s.outerHeight() + y.arrowSize.a);
			break
		}
		w.css({
			left : y.left || x.x,
			top : y.top || x.y
		});
		f(".interactive-arrow", w).css({
			left : u.x,
			top : u.y
		})
	};
	var j = function(r) {
		var s = r || f("#jquery-interactive-box2");
		f("#jquery-interactive-iframe", s).height(s.outerHeight()).width(
				s.outerWidth());
		if (s.data("customPosition")) {
			return
		}
		e(s)
	};
	function l() {
		c();
		f("#jquery-interactive-box2 .interactive-loading").css("visibility",
				"visible")
	}
	function h() {
		f("#jquery-interactive-box2 .interactive-loading").css("visibility",
				"hidden")
	}
	function o() {
		var r = f("#jquery-interactive-box2");
		f("button[type=submit]", r).attr("disabled", true).addClass("disabled")
	}
	function i() {
		var r = f("#jquery-interactive-box2");
		f("button[type=submit]", r).attr("disabled", false).removeClass(
				"disabled")
	}
	function d(t) {
		h();
		var r = f(".interactive-main div.interactive-error");
		var s = f(".interactive-main div.interactive-main");
		r.width(s.width() - 10).show().find("div").html(t)
	}
	function n(r) {
		m();
		f.alert(r, {
			title : "é”™è¯¯"
		})
	}
	function c() {
		f(".interactive-main div.interactive-error").hide().find("div")
				.html("")
	}
	var q = function(u, v, t) {
		u = u || "æ“ä½œæˆåŠŸ";
		h();
		var r = f(".interactive-main div.interactive-success");
		var s = f("div.interactive-main");
		r.width(s.width() - 20).show().find("div").html(
				'<span class="icon_success">' + u + "</span>");
		r.show().appendTo(
				f(".interactive-main div.interactive-content").empty());
		if (v && v.constructor == Function) {
			b = setTimeout((function() {
				v.apply(t, arguments);
				m()
			}), 3000)
		}
	};
	var p = function(r) {
		return (/^[^<]+(<([a-z]+)>[^<]*<\/\2>[^<]*)*$|^<([a-z]+)>[^<]*<\/\3>[^<]+$/i)
				.exec(r.toString() || r)
	};
	var a = {
		width : "auto",
		maxWidth : 20,
		minWidth : 12,
		height : 200,
		title : "",
		mask : false,
		liveTime : null,
		selector : null,
		onComplete : null,
		onabort : null,
		ondone : null,
		onerror : null,
		ontimeout : null,
		animate : "show",
		type : "box2"
	};
	f.extend({
		alert : function(v, t) {
			var v = v || "";
			var u = {
				type : "alert",
				liveTime : "3000",
				preButtons : false,
				direction : null,
				align : null,
				mask : true,
				noArrow : true,
				noCloser : false
			};
			t = f.extend({}, a, u, t);
			if (f.alert.timeoutId) {
				clearTimeout(f.alert.timeoutId)
			}
			var w = g(t);
			w.width(t.width).css("zIndex", 212121888);
			var s = w.find("div.interactive-content");
			s.html(v);
			if (f.browser.msie && p(v)) {
				var r = v.replace(/<\/?\w+>/ig, "").length;
				if (t.preButtons) {
					r = r < t.minWidth ? t.minWidth : r
				}
				s.width(r > t.maxWidth ? t.maxWidth + "em" : r + "em");
				if (!t.noCloser) {
					f("div.interactive-main", w).css("padding-right", "44px")
				}
			}
			if (t.preButtons == false) {
				f("div.interactive-bottom", w).remove();
				if (t.liveTime) {
					f.alert.timeoutId = setTimeout(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
					}, t.liveTime)
				}
			}
			j(w);
			f("div.interactive-bottom button[type=submit]", w).focus();
			f("div.interactive-bottom button", w).add(
					f("a.interactive-x", w).unbind("click")).unbind("click")
					.click(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
						return false
					});
			return w
		},
		notice : function(v, t) {
			var v = v || "";
			var u = {
				type : "notice",
				liveTime : "3000",
				preButtons : false,
				direction : "right",
				align : "middle",
				mask : false,
				target : undefined
			};
			t = f.extend({}, a, u, t);
			if (f.notice.timeoutId) {
				clearTimeout(f.notice.timeoutId)
			}
			var w = g(t);
			w.width(t.width).css("zIndex", 212121888);
			var s = w.find("div.interactive-content");
			s.html(v);
			if (f.browser.msie && p(v)) {
				var r = v.replace(/<\/?\w+>/ig, "").length;
				if (t.preButtons) {
					r = r < t.minWidth ? t.minWidth : r
				}
				s.width(r > t.maxWidth ? t.maxWidth + "em" : r + "em");
				if (!t.noCloser) {
					f("div.interactive-main", w).css("padding-right", "44px")
				}
			}
			if (t.preButtons == false) {
				f("div.interactive-bottom", w).remove();
				if (t.liveTime) {
					f.notice.timeoutId = setTimeout(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
					}, t.liveTime)
				}
			}
			j(w);
			f("div.interactive-bottom button[type=submit]", w).focus();
			f("div.interactive-bottom button", w).add(
					f("a.interactive-x", w).unbind("click")).unbind("click")
					.click(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
						return false
					});
			return w
		},
		errormsg : function(v, t) {
			var v = v || "";
			var u = {
				type : "errormsg",
				liveTime : "5000",
				preButtons : false,
				direction : "right",
				align : "middle",
				mask : false,
				noArrow : false,
				noCloser : true,
				target : undefined,
				arrowSize : {
					a : 6,
					b : 6
				},
				outerFix : {
					t : 0,
					r : 0,
					b : 0,
					l : 0
				}
			};
			t = f.extend({}, a, u, t);
			if (f.errormsg.timeoutId) {
				clearTimeout(f.errormsg.timeoutId)
			}
			var w = g(t);
			w.width(t.width).css("zIndex", 212121888);
			var s = w.find("div.interactive-content");
			s.html(v);
			if (f.browser.msie && p(v)) {
				var r = v.replace(/<\/?\w+>/ig, "").length;
				if (t.preButtons) {
					r = r < t.minWidth ? t.minWidth : r
				}
				s.width(r > t.maxWidth ? t.maxWidth + "em" : r + "em");
				if (!t.noCloser) {
					f("div.interactive-main", w).css("padding-right", "44px")
				}
			}
			if (t.preButtons == false) {
				f("div.interactive-bottom", w).remove();
				if (t.liveTime) {
					f.errormsg.timeoutId = setTimeout(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
					}, t.liveTime)
				}
			}
			j(w);
			f("div.interactive-bottom button[type=submit]", w).focus();
			f("div.interactive-bottom button", w).add(
					f("a.interactive-x", w).unbind("click")).unbind("click")
					.click(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
						return false
					});
			return w
		},
		successmsg : function(v, t) {
			var v = v || "";
			var u = {
				type : "successmsg",
				liveTime : "5000",
				preButtons : false,
				direction : "right",
				align : "middle",
				mask : false,
				noArrow : false,
				noCloser : true,
				target : undefined,
				arrowSize : {
					a : 6,
					b : 6
				},
				outerFix : {
					t : 0,
					r : 0,
					b : 0,
					l : 0
				}
			};
			t = f.extend({}, a, u, t);
			if (f.errormsg.timeoutId) {
				clearTimeout(f.errormsg.timeoutId)
			}
			var w = g(t);
			w.width(t.width).css("zIndex", 212121888);
			var s = w.find("div.interactive-content");
			s.html(v);
			if (f.browser.msie && p(v)) {
				var r = v.replace(/<\/?\w+>/ig, "").length;
				if (t.preButtons) {
					r = r < t.minWidth ? 4 : r
				}
				s.width(r > t.maxWidth ? t.maxWidth + "em" : r + "em");
				if (!t.noCloser) {
					f("div.interactive-main", w).css("padding-right", "44px")
				}
			}
			if (t.preButtons == false) {
				f("div.interactive-bottom", w).remove();
				if (t.liveTime) {
					f.errormsg.timeoutId = setTimeout(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
					}, t.liveTime)
				}
			}
			j(w);
			f("div.interactive-bottom button[type=submit]", w).focus();
			f("div.interactive-bottom button", w).add(
					f("a.interactive-x", w).unbind("click")).unbind("click")
					.click(function() {
						m(t.type);
						if (t.onClose) {
							t.onClose.call(w)
						}
						return false
					});
			return w
		},
		dialog : function(v, s) {
			var v = v || "";
			var u = {
				title : "",
				type : "box2",
				liveTime : "3000",
				preButtons : false
			};
			s = f.extend({}, a, u, s);
			var w = g(s);
			var r = w.find("div.interactive-content");
			if (v.constructor == String) {
				r.html(v);
				if (r.height() < 20) {
					f("div.interactive-main", w).css("padding", "50px 25px")
				}
			} else {
				var t = f(v);
				if (!t.length) {
					return false
				}
				r.html("").append(t.children().clone(true))
			}
			if (s.preButtons == false) {
				f("div.interactive-bottom", w).remove()
			}
			j(w);
			if (isIE6()) {
				setTimeout((function() {
					j(w)
				}), 200)
			}
			f("div.interactive-bottom button[type=submit]", w).focus();
			f("div.interactive-bottom button", w).add(
					f("a.interactive-x", w).unbind("click")).unbind("click")
					.click(function() {
						m(s.type);
						if (s.onClose) {
							s.onClose.call(w)
						}
						return false
					});
			f("div.interactive-main", w).find(":text:first").focus();
			return w
		},
		confirm : function(v, t) {
			var v = v || "ç¡®å®šè¦è¿›è¡Œè¯¥æ“ä½œå—ï¼Ÿ";
			var u = {
				noCloser : true,
				type : "confirm",
				liveTime : "3000",
				preButtons : true,
				direction : null,
				align : null,
				mask : true,
				noArrow : true
			};
			t = f.extend({}, a, u, t);
			var w = g(t);
			w.width(t.width);
			var s = w.find("div.interactive-content");
			s.html(v);
			if (f.browser.msie && p(v)) {
				var r = v.replace(/<\/?\w+>/ig, "").length;
				if (t.preButtons) {
					r = r < t.minWidth ? t.minWidth : r
				}
				w.find("div.interactive-content").css("width",
						r > t.maxWidth ? t.maxWidth + "em" : r + "em");
				if (!t.noCloser) {
					f("div.interactive-main", w).css("padding-right", "44px")
				}
			}
			j(w);
			if (isIE6()) {
				setTimeout((function() {
					j(w)
				}), 200)
			}
			f("div.interactive-bottom button[type=submit]", w).focus();
			function x() {
				m(t.type);
				if (t.onClose) {
					t.onClose.call(w)
				}
			}
			f("div.interactive-bottom button[type=submit]", w).click(
					function() {
						if (t.onAccept) {
							t.onAccept(w)
						}
						x()
					});
			f("div.interactive-bottom button[type=reset]", w).click(function() {
				if (t.onCancel) {
					t.onCancel(w)
				}
				x()
			});
			f("a.interactive-x", w).unbind("click").click(function() {
				if (t.onCancel) {
					t.onCancel(w)
				}
				x();
				return false
			});
			return w
		},
		sprite : function(t, z) {
			var t = f.trim(t);
			var w = {
				title : "",
				noArrow : false,
				mask : true,
				direction : null,
				align : null,
				dontBind : false
			};
			z = f.extend({}, a, w, z);
			var s = g(z);
			var u = f("div.interactive-content", s);
			var v = f("div.interactive-bottom", s);
			u.html('<p style="width:' + z.minWidth
					+ 'em">è½½å…¥ä¸­ï¼Œè¯·ç¨å€™...</p>');
			v.hide();
			l();
			j(s);
			var x = "ajax";
			var r = (/^(\w+:)?\/\/([^\/?#]+)/.exec(t));
			if (r) {
				r = r[0];
				var y = location.protocol + "//" + location.host;
				if (r !== y) {
					x = "swfajax"
				}
			}
			(f[x] || f.ajax)({
				url : t + "&" + +new Date,
				success : function(B) {
					if (B.code) {
						if (z.onClose) {
							z.onClose.call(s)
						}
						f.UI.hide();
						f.alert(B.msg);
						return false
					}
					u.html(B.msg);
					if (z.preButtons == false) {
						v.remove()
					} else {
						v.show()
					}
					j(s);
					f("div.interactive-main", s).find(":text:first").focus();
					if (z.onLoad) {
						z.onLoad.call(z.link, s)
					}
					f("a.interactive-x", s).unbind("click").click(function() {
						if (z.onCancel) {
							z.onCancel(s)
						}
						m(z.type);
						if (z.onClose) {
							z.onClose.call(s)
						}
					});
					h();
					j(s);
					if (z.dontBind) {
						return
					}
					var A = f("form", s);
					f("button[type=submit]", s).click(function() {
						if (z.onAccept) {
							z.onAccept(s)
						}
						if (!f(this).parents("form").length) {
							A.submit()
						}
					});
					f("button[type=reset]", s).click(function() {
						if (z.onCancel) {
							z.onCancel(s)
						}
						m(z.type);
						if (z.onClose) {
							z.onClose.call(s)
						}
					});
					if (A.attr("action") === "") {
						A.attr("action", t)
					}
					A.ajaxForm({
						type : "POST",
						dataType : "json",
						beforeSubmit : function() {
							if (z.onBeforeSubmit) {
								var C = z.onBeforeSubmit.call(z.link, s);
								if (!C) {
									return false
								}
							}
							o();
							l()
						},
						success : function(D) {
							var C = D.code;
							if (C == 0) {
								m(z.type);
								if (z.onComplete) {
									z.onComplete.call(z.link, s, D)
								}
								if (z.onClose) {
									z.onClose.call(z.link, s)
								}
							} else {
								d(D.msg)
							}
							i();
							h()
						},
						error : function() {
							d("ä¸ŽæœåŠ¡å™¨é€šè®¯æ—¶å‡ºé”™, è¯·é‡è¯•");
							i();
							h()
						},
						timeout : function() {
							d("ä¸ŽæœåŠ¡å™¨çš„é€šè®¯è¶…æ—¶, è¯·é‡è¯•");
							i();
							h()
						}
					})
				}
			});
			return false
		},
		mask : function(r) {
			var r = f.extend({
				opacity : 0.2,
				animate : "show",
				color : "#000000"
			}, r);
			m("mask");
			var s = f('<div id="jquery-interactive-mask"></div>').appendTo(
					document.body);
			s.addClass("masking")[r.animate]();
			s.css({
				width : f(window).width(),
				height : f(document).height(),
				opacity : r.opacity,
				backgroundColor : r.color,
				zIndex : 99990
			})
		}
	});
	f.fn.extend({
		dialog : function(r) {
			var s = {
				title : ""
			};
			var t;
			r = f.extend(s, r);
			f(this).each(function() {
				if (this.tagName.toUpperCase() == "A") {
					f(this).click(function() {
						t = f.dialog(f(this).attr("srv") || this.href, r);
						return false
					})
				} else {
					t = f.dialog(this, r)
				}
			});
			return t
		},
		confirm : function(u, r) {
			var s = {
				direction : "down",
				align : "right",
				mask : false,
				noArrow : false
			};
			var t;
			r = f.extend(s, r);
			return this.each(function() {
				r.target = this;
				t = f.confirm(u, r)
			})
		},
		sprite : function(s, r) {
			var t = {
				direction : "down",
				align : "right",
				mask : false,
				noArrow : false
			};
			var u;
			r = f.extend(t, r);
			return this.each(function() {
				r.target = this;
				r.link = f(this);
				f.sprite(s, r);
				return false
			})
		},
		notice : function(u, r) {
			var s = {
				liveTime : 3000
			};
			var t;
			r = f.extend(s, r);
			return this.each(function() {
				r.target = this;
				t = f.notice(u, r)
			})
		},
		errormsg : function(t, r) {
			var s;
			r = f.extend({
				roundCorner : false
			}, r);
			return this.each(function() {
				r.target = this;
				s = f.errormsg(t, r)
			})
		},
		successmsg : function(t, r) {
			var s;
			r = f.extend({
				roundCorner : false
			}, r);
			return this.each(function() {
				r.target = this;
				s = f.successmsg(t, r)
			})
		}
	});
	f.UI = f.UI || {};
	f.UI["hide"] = f.UI["hide"] || m
})(jQuery);
var _debug_ = true;
function getMidOfClient(e) {
	var b = $(e);
	if (!b.length) {
		return
	}
	var d = $(window);
	var c = $(document);
	var a = {};
	a.x = ((d.width() - b.outerWidth()) / 2 + c.scrollLeft()) >> 0;
	a.y = ((d.height() - b.outerHeight()) / 2 + c.scrollTop()) >> 0;
	return a
}
function isIE6() {
	return ($.browser.version == "6.0") && $.browser.msie
};