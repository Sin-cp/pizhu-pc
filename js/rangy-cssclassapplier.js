/*
 CSS Class Applier module for Rangy.
 Adds, removes and toggles CSS classes on Ranges and Selections

 Part of Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Depends on Rangy core.

 Copyright 2011, Tim Down
 Licensed under the MIT license.
 Version: 1.1
 Build date: 8 April 2011
*/
rangy.createModule("CssClassApplier", function(h) {
	function s(a) {
		return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
	}

	function m(a, b) {
		return a.className && RegExp("(?:^|\\s)" + b + "(?:\\s|$)").test(a.className)
	}

	function t(a, b) {
		if (a.className) m(a, b) || (a.className += " " + b);
		else a.className = b
	}

	function n(a) {
		return a.className.split(/\s+/).sort().join(" ")
	}

	function u(a, b) {
		return n(a) == n(b)
	}

	function v(a) {
		for (var b = a.parentNode; a.hasChildNodes();) b.insertBefore(a.firstChild, a);
		b.removeChild(a)
	}

	function w(a, b) {
		if (a.attributes.length !=
			b.attributes.length) return false;
		for (var c = 0, d = a.attributes.length, e, f; c < d; ++c) {
			e = a.attributes[c];
			f = e.name;
			if (f != "class") {
				f = b.attributes.getNamedItem(f);
				if (e.specified != f.specified) return false;
				if (e.specified && e.nodeValue !== f.nodeValue) return false
			}
		}
		return true
	}

	function x(a) {
		for (var b = 0, c = a.attributes.length; b < c; ++b)
			if (a.attributes[b].specified && a.attributes[b].name != "class") return true;
		return false
	}

	function y(a, b) {
		if (g.isCharacterDataNode(a)) return b == 0 ? !!a.previousSibling : b == a.length ? !!a.nextSibling :
			true;
		return b > 0 && b < a.childNodes.length
	}

	function k(a, b, c) {
		var d;
		if (g.isCharacterDataNode(b))
			if (c == 0) {
				c = g.getNodeIndex(b);
				b = b.parentNode
			} else if (c == b.length) {
			c = g.getNodeIndex(b) + 1;
			b = b.parentNode
		} else d = g.splitDataNode(b, c);
		if (!d) {
			d = b.cloneNode(false);
			d.id && d.removeAttribute("id");
			for (var e; e = b.childNodes[c];) d.appendChild(e);
			g.insertAfter(d, b)
		}
		return b == a ? d : k(a, d.parentNode, g.getNodeIndex(d))
	}

	function z(a, b) {
		var c = a.nodeType == 3,
			d = c ? a.parentNode : a,
			e = b ? "nextSibling" : "previousSibling";
		if (c) {
			if ((c = a[e]) &&
				c.nodeType == 3) return c
		} else if ((c = d[e]) && a.tagName == c.tagName && u(a, c) && w(a, c)) return c[b ? "firstChild" : "lastChild"];
		return null
	}

	function o(a) {
		this.firstTextNode = (this.isElementMerge = a.nodeType == 1) ? a.lastChild : a;
		if (this.isElementMerge) this.sortedCssClasses = n(a);
		this.textNodes = [this.firstTextNode]
	}

	function l(a, b, c) {
		this.cssClass = a;
		this.normalize = b;
		this.applyToAnyTagName = false;
		switch (typeof c) {
			case "string":
				if (c == "*") this.applyToAnyTagName = true;
				else this.tagNames = s(c.toLowerCase()).split(/\s*,\s*/);
				break;
			default:
				this.tagNames = [p];
				break
		}
	}
	h.requireModules(["WrappedSelection", "WrappedRange"]);
	var g = h.dom,
		p = "span",
		A = function() {
			function a(b, c, d) {
				return c && d ? " " : ""
			}
			return function(b, c) {
				if (b.className) b.className = b.className.replace(RegExp("(?:^|\\s)" + c + "(?:\\s|$)"), a)
			}
		}();
	o.prototype = {
		doMerge: function() {
			for (var a = [], b, c, d = 0, e = this.textNodes.length; d < e; ++d) {
				b = this.textNodes[d];
				c = b.parentNode;
				a[d] = b.data;
				if (d) {
					c.removeChild(b);
					c.hasChildNodes() || c.parentNode.removeChild(c)
				}
			}
			return this.firstTextNode.data =
				a = a.join("")
		},
		getLength: function() {
			for (var a = this.textNodes.length, b = 0; a--;) b += this.textNodes[a].length;
			return b
		},
		toString: function() {
			for (var a = [], b = 0, c = this.textNodes.length; b < c; ++b) a[b] = "'" + this.textNodes[b].data + "'";
			return "[Merge(" + a.join(",") + ")]"
		}
	};
	l.prototype = {
		getAncestorWithClass: function(a) {
			for (a = a.parentNode; a;) {
				if (a.nodeType == 1 && g.arrayContains(this.tagNames, a.tagName.toLowerCase()) && m(a, this.cssClass)) return a;
				a = a.parentNode
			}
			return false
		},
		postApply: function(a, b) {
			for (var c = a[0], d = a[a.length -
					1], e = [], f, q = c, B = d, C = 0, D = d.length, j, E, i = 0, r = a.length; i < r; ++i) {
				j = a[i];
				if (E = z(j, false)) {
					if (!f) {
						f = new o(E);
						e.push(f)
					}
					f.textNodes.push(j);
					if (j === c) {
						q = f.firstTextNode;
						C = q.length
					}
					if (j === d) {
						B = f.firstTextNode;
						D = f.getLength()
					}
				} else f = null
			}
			if (c = z(d, true)) {
				if (!f) {
					f = new o(d);
					e.push(f)
				}
				f.textNodes.push(c)
			}
			if (e.length) {
				i = 0;
				for (r = e.length; i < r; ++i) e[i].doMerge();
				b.setStart(q, C);
				b.setEnd(B, D)
			}
		},
		createContainer: function(a) {
			a = a.createElement(p);
			a.className = this.cssClass;
			return a
		},
		applyToTextNode: function(a) {
			var b = a.parentNode;
			if (b.childNodes.length == 1 && g.arrayContains(this.tagNames, b.tagName.toLowerCase())) t(b, this.cssClass);
			else {
				b = this.createContainer(g.getDocument(a));
				a.parentNode.insertBefore(b, a);
				b.appendChild(a)
			}
		},
		isRemovable: function(a) {
			return a.tagName.toLowerCase() == p && s(a.className) == this.cssClass && !x(a)
		},
		undoToTextNode: function(a, b, c) {
			if (!b.containsNode(c)) {
				a = b.cloneRange();
				a.selectNode(c);
				if (a.isPointInRange(b.endContainer, b.endOffset) && y(b.endContainer, b.endOffset)) {
					k(c, b.endContainer, b.endOffset);
					b.setEndAfter(c)
				}
				if (a.isPointInRange(b.startContainer,
						b.startOffset) && y(b.startContainer, b.startOffset)) c = k(c, b.startContainer, b.startOffset)
			}
			this.isRemovable(c) ? v(c) : A(c, this.cssClass)
		},
		applyToRange: function(a) {
			a.splitBoundaries();
			var b = a.getNodes([3]);
			if (b.length) {
				for (var c, d = 0, e = b.length; d < e; ++d) {
					c = b[d];
					this.getAncestorWithClass(c) || this.applyToTextNode(c)
				}
				a.setStart(b[0], 0);
				c = b[b.length - 1];
				a.setEnd(c, c.length);
				this.normalize && this.postApply(b, a)
			}
		},
		applyToSelection: function(a) {
			a = a || window;
			a = h.getSelection(a);
			var b, c = a.getAllRanges();
			a.removeAllRanges();
			for (var d = c.length; d--;) {
				b = c[d];
				this.applyToRange(b);
				a.addRange(b)
			}
		},
		undoToRange: function(a) {
			a.splitBoundaries();
			var b = a.getNodes([3]),
				c, d;
			if (b.length) {
				for (var e = 0, f = b.length; e < f; ++e) {
					c = b[e];
					(d = this.getAncestorWithClass(c)) && this.undoToTextNode(c, a, d)
				}
				a.setStart(b[0], 0);
				c = b[b.length - 1];
				a.setEnd(c, c.length);
				this.normalize && this.postApply(b, a)
			}
		},
		undoToSelection: function(a) {
			a = a || window;
			a = h.getSelection(a);
			var b = a.getAllRanges(),
				c;
			a.removeAllRanges();
			for (var d = 0, e = b.length; d < e; ++d) {
				c = b[d];
				this.undoToRange(c);
				a.addRange(c)
			}
		},
		getTextSelectedByRange: function(a, b) {
			var c = b.cloneRange();
			c.selectNodeContents(a);
			var d = c.intersection(b);
			d = d ? d.toString() : "";
			c.detach();
			return d
		},
		isAppliedToRange: function(a) {
			for (var b = a.getNodes([3]), c = 0, d = b.length, e; c < d; ++c) {
				e = this.getTextSelectedByRange(b[c], a);
				if (e != "" && !this.getAncestorWithClass(b[c])) return false
			}
			return true
		},
		isAppliedToSelection: function(a) {
			a = a || window;
			a = h.getSelection(a).getAllRanges();
			for (var b = a.length; b--;)
				if (!this.isAppliedToRange(a[b])) return false;
			return true
		},
		toggleRange: function(a) {
			this.isAppliedToRange(a) ? this.undoToRange(a) : this.applyToRange(a)
		},
		toggleSelection: function(a) {
			this.isAppliedToSelection(a) ? this.undoToSelection(a) : this.applyToSelection(a)
		},
		detach: function() {}
	};
	l.util = {
		hasClass: m,
		addClass: t,
		removeClass: A,
		hasSameClasses: u,
		replaceWithOwnChildren: v,
		elementsHaveSameNonClassAttributes: w,
		elementHasNonClassAttributes: x,
		splitNodeAt: k
	};
	h.CssClassApplier = l;
	h.createCssClassApplier = function(a, b, c) {
		return new l(a, b, c)
	}
});
