/*
 Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Copyright 2011, Tim Down
 Licensed under the MIT license.
 Version: 1.1
 Build date: 8 April 2011
*/
var rangy = function() {
	function m(n, r) {
		var A = typeof n[r];
		return A == "function" || !!(A == "object" && n[r]) || A == "unknown"
	}

	function N(n, r) {
		return !!(typeof n[r] == "object" && n[r])
	}

	function I(n, r) {
		return typeof n[r] != "undefined"
	}

	function E(n) {
		return function(r, A) {
			for (var O = A.length; O--;)
				if (!n(r, A[O])) return false;
			return true
		}
	}

	function x(n) {
		window.alert("Rangy not supported in your browser. Reason: " + n);
		q.initialized = true;
		q.supported = false
	}

	function D() {
		if (!q.initialized) {
			var n, r = false,
				A = false;
			if (m(document, "createRange")) {
				n =
					document.createRange();
				if (w(n, j) && s(n, Q)) r = true;
				n.detach()
			}
			if ((n = N(document, "body") ? document.body : document.getElementsByTagName("body")[0]) && m(n, "createTextRange")) {
				n = n.createTextRange();
				if (w(n, t) && s(n, o)) A = true
			}!r && !A && x("Neither Range nor TextRange are implemented");
			q.initialized = true;
			q.features = {
				implementsDomRange: r,
				implementsTextRange: A
			};
			r = f.concat(d);
			A = 0;
			for (n = r.length; A < n; ++A) try {
				r[A](q)
			} catch (O) {
				N(window, "console") && m(window.console, "log") && window.console.log(
					"Init listener threw an exception. Continuing.",
					O)
			}
		}
	}

	function J(n) {
		this.name = n;
		this.supported = this.initialized = false
	}
	var Q = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer",
			"START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"
		],
		j = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore", "setEndAfter", "collapse",
			"selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents", "extractContents", "cloneContents",
			"insertNode", "surroundContents", "cloneRange", "toString", "detach"
		],
		o = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"],
		t = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark", "moveToElementText",
			"parentElement", "pasteHTML", "select", "setEndPoint"
		],
		w = E(m),
		B = E(N),
		s = E(I),
		q = {
			initialized: false,
			supported: true,
			util: {
				isHostMethod: m,
				isHostObject: N,
				isHostProperty: I,
				areHostMethods: w,
				areHostObjects: B,
				areHostProperties: s
			},
			features: {},
			modules: {},
			config: {
				alertOnWarn: false
			}
		};
	q.fail = x;
	q.warn = function(n) {
		n = "Rangy warning: " + n;
		if (q.config.alertOnWarn) window.alert(n);
		else typeof window.console != "undefined" && typeof window.console.log != "undefined" && window.console.log(n)
	};
	var d = [],
		f = [];
	q.init = D;
	q.addInitListener = function(n) {
		q.initialized ? n(q) : d.push(n)
	};
	var i = [];
	q.addCreateMissingNativeApiListener = function(n) {
		i.push(n)
	};
	q.createMissingNativeApi = function(n) {
		n = n || window;
		D();
		for (var r = 0, A = i.length; r < A; ++r) i[r](n)
	};
	J.prototype.fail = function(n) {
		this.initialized = true;
		this.supported = false;
		throw Error("Module '" + this.name + "' failed to load: " + n);
	};
	J.prototype.warn = function(n) {
		q.warn("Module " +
			this.name + ": " + n)
	};
	J.prototype.createError = function(n) {
		return Error("Error in Rangy " + this.name + " module: " + n)
	};
	q.createModule = function(n, r) {
		var A = new J(n);
		q.modules[n] = A;
		f.push(function(O) {
			r(O, A);
			A.initialized = true;
			A.supported = true
		})
	};
	q.requireModules = function(n) {
		for (var r = 0, A = n.length, O, R; r < A; ++r) {
			R = n[r];
			O = q.modules[R];
			if (!O || !(O instanceof J)) throw Error("Module '" + R + "' not found");
			if (!O.supported) throw Error("Module '" + R + "' not supported");
		}
	};
	var u = false;
	B = function() {
		if (!u) {
			u = true;
			q.initialized ||
				D()
		}
	};
	if (typeof window == "undefined") x("No window found");
	else if (typeof document == "undefined") x("No document found");
	else {
		m(document, "addEventListener") && document.addEventListener("DOMContentLoaded", B, false);
		if (m(window, "addEventListener")) window.addEventListener("load", B, false);
		else m(window, "attachEvent") ? window.attachEvent("onload", B) : x(
			"Window does not have required addEventListener or attachEvent method");
		return q
	}
}();
rangy.createModule("DomUtil", function(m, N) {
	function I(d) {
		for (var f = 0; d = d.previousSibling;) f++;
		return f
	}

	function E(d, f) {
		var i = [],
			u;
		for (u = d; u; u = u.parentNode) i.push(u);
		for (u = f; u; u = u.parentNode)
			if (q(i, u)) return u;
		return null
	}

	function x(d, f, i) {
		for (i = i ? d : d.parentNode; i;) {
			d = i.parentNode;
			if (d === f) return i;
			i = d
		}
		return null
	}

	function D(d) {
		d = d.nodeType;
		return d == 3 || d == 4 || d == 8
	}

	function J(d, f) {
		var i = f.nextSibling,
			u = f.parentNode;
		i ? u.insertBefore(d, i) : u.appendChild(d);
		return d
	}

	function Q(d) {
		if (d.nodeType == 9) return d;
		else if (typeof d.ownerDocument != "undefined") return d.ownerDocument;
		else if (typeof d.document != "undefined") return d.document;
		else if (d.parentNode) return Q(d.parentNode);
		else throw Error("getDocument: no document found for node");
	}

	function j(d) {
		if (!d) return "[No node]";
		return D(d) ? '"' + d.data + '"' : d.nodeType == 1 ? "<" + d.nodeName + (d.id ? ' id="' + d.id + '"' : "") + ">[" +
			d.childNodes.length + "]" : d.nodeName
	}

	function o(d) {
		this._next = this.root = d
	}

	function t(d, f) {
		this.node = d;
		this.offset = f
	}

	function w(d) {
		this.code = this[d];
		this.codeName = d;
		this.message = "DOMException: " + this.codeName
	}
	var B = m.util;
	B.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"]) || N.fail(
		"document missing a Node creation method");
	B.isHostMethod(document, "getElementsByTagName") || N.fail("document missing getElementsByTagName method");
	var s = document.createElement("div");
	B.areHostMethods(s, ["insertBefore", "appendChild", "cloneNode"]) || N.fail("Incomplete Element implementation");
	s = document.createTextNode("test");
	B.areHostMethods(s,
		["splitText", "deleteData", "insertData", "appendData", "cloneNode"]) || N.fail(
		"Incomplete Text Node implementation");
	var q = function(d, f) {
		for (var i = d.length; i--;)
			if (d[i] === f) return true;
		return false
	};
	o.prototype = {
		_current: null,
		hasNext: function() {
			return !!this._next
		},
		next: function() {
			var d = this._current = this._next,
				f;
			if (this._current)
				if (f = d.firstChild) this._next = f;
				else {
					for (f = null; d !== this.root && !(f = d.nextSibling);) d = d.parentNode;
					this._next = f
				} return this._current
		},
		detach: function() {
			this._current = this._next =
				this.root = null
		}
	};
	t.prototype = {
		equals: function(d) {
			return this.node === d.node & this.offset == d.offset
		},
		inspect: function() {
			return "[DomPosition(" + j(this.node) + ":" + this.offset + ")]"
		}
	};
	w.prototype = {
		INDEX_SIZE_ERR: 1,
		HIERARCHY_REQUEST_ERR: 3,
		WRONG_DOCUMENT_ERR: 4,
		NO_MODIFICATION_ALLOWED_ERR: 7,
		NOT_FOUND_ERR: 8,
		NOT_SUPPORTED_ERR: 9,
		INVALID_STATE_ERR: 11
	};
	w.prototype.toString = function() {
		return this.message
	};
	m.dom = {
		arrayContains: q,
		getNodeIndex: I,
		getCommonAncestor: E,
		isAncestorOf: function(d, f, i) {
			for (f = i ? f : f.parentNode; f;)
				if (f ===
					d) return true;
				else f = f.parentNode;
			return false
		},
		getClosestAncestorIn: x,
		isCharacterDataNode: D,
		insertAfter: J,
		splitDataNode: function(d, f) {
			var i;
			if (d.nodeType == 3) i = d.splitText(f);
			else {
				i = d.cloneNode();
				i.deleteData(0, f);
				d.deleteData(0, d.length - f);
				J(i, d)
			}
			return i
		},
		getDocument: Q,
		getWindow: function(d) {
			d = Q(d);
			if (typeof d.defaultView != "undefined") return d.defaultView;
			else if (typeof d.parentWindow != "undefined") return d.parentWindow;
			else throw Error("Cannot get a window object for node");
		},
		getIframeWindow: function(d) {
			if (typeof d.contentWindow !=
				"undefined") return d.contentWindow;
			else if (typeof d.contentDocument != "undefined") return d.contentDocument.defaultView;
			else throw Error("getIframeWindow: No Window object found for iframe element");
		},
		getIframeDocument: function(d) {
			if (typeof d.contentDocument != "undefined") return d.contentDocument;
			else if (typeof d.contentWindow != "undefined") return d.contentWindow.document;
			else throw Error("getIframeWindow: No Document object found for iframe element");
		},
		getBody: function(d) {
			return B.isHostObject(d, "body") ?
				d.body : d.getElementsByTagName("body")[0]
		},
		comparePoints: function(d, f, i, u) {
			var n;
			if (d == i) return f === u ? 0 : f < u ? -1 : 1;
			else if (n = x(i, d, true)) return f <= I(n) ? -1 : 1;
			else if (n = x(d, i, true)) return I(n) < u ? -1 : 1;
			else {
				f = E(d, i);
				d = d === f ? f : x(d, f, true);
				i = i === f ? f : x(i, f, true);
				if (d === i) throw Error("comparePoints got to case 4 and childA and childB are the same!");
				else {
					for (f = f.firstChild; f;) {
						if (f === d) return -1;
						else if (f === i) return 1;
						f = f.nextSibling
					}
					throw Error("Should not be here!");
				}
			}
		},
		inspectNode: j,
		createIterator: function(d) {
			return new o(d)
		},
		DomPosition: t
	};
	m.DOMException = w
});
rangy.createModule("DomRange", function(m) {
	function N(b, h) {
		return b.nodeType != 3 && (k.isAncestorOf(b, h.startContainer, true) || k.isAncestorOf(b, h.endContainer, true))
	}

	function I(b) {
		return k.getDocument(b.startContainer)
	}

	function E(b, h, v) {
		if (h = b._listeners[h])
			for (var y = 0, M = h.length; y < M; ++y) h[y].call(b, {
				target: b,
				args: v
			})
	}

	function x(b) {
		return new Z(b.parentNode, k.getNodeIndex(b))
	}

	function D(b) {
		return new Z(b.parentNode, k.getNodeIndex(b) + 1)
	}

	function J(b) {
		return k.isCharacterDataNode(b) ? b.length : b.childNodes ?
			b.childNodes.length : 0
	}

	function Q(b, h, v) {
		var y = b.nodeType == 11 ? b.firstChild : b;
		if (k.isCharacterDataNode(h)) v == h.length ? k.insertAfter(b, h) : h.parentNode.insertBefore(b, v == 0 ? h : k.splitDataNode(
			h, v));
		else v >= h.childNodes.length ? h.appendChild(b) : h.insertBefore(b, h.childNodes[v]);
		return y
	}

	function j(b) {
		for (var h, v, y = I(b.range).createDocumentFragment(); v = b.next();) {
			h = b.isPartiallySelectedSubtree();
			v = v.cloneNode(!h);
			if (h) {
				h = b.getSubtreeIterator();
				v.appendChild(j(h));
				h.detach(true)
			}
			if (v.nodeType == 10) throw new S("HIERARCHY_REQUEST_ERR");
			y.appendChild(v)
		}
		return y
	}

	function o(b, h, v) {
		var y, M;
		for (v = v || {
				stop: false
			}; y = b.next();)
			if (b.isPartiallySelectedSubtree())
				if (h(y) === false) {
					v.stop = true;
					return
				} else {
					y = b.getSubtreeIterator();
					o(y, h, v);
					y.detach(true);
					if (v.stop) return
				}
		else
			for (y = k.createIterator(y); M = y.next();)
				if (h(M) === false) {
					v.stop = true;
					return
				}
	}

	function t(b) {
		for (var h; b.next();)
			if (b.isPartiallySelectedSubtree()) {
				h = b.getSubtreeIterator();
				t(h);
				h.detach(true)
			} else b.remove()
	}

	function w(b) {
		for (var h, v = I(b.range).createDocumentFragment(), y; h =
			b.next();) {
			if (b.isPartiallySelectedSubtree()) {
				h = h.cloneNode(false);
				y = b.getSubtreeIterator();
				h.appendChild(w(y));
				y.detach(true)
			} else b.remove();
			if (h.nodeType == 10) throw new S("HIERARCHY_REQUEST_ERR");
			v.appendChild(h)
		}
		return v
	}

	function B(b, h, v) {
		var y = !!(h && h.length),
			M, W = !!v;
		if (y) M = RegExp("^(" + h.join("|") + ")$");
		var ba = [];
		o(new q(b, false), function(ca) {
			if ((!y || M.test(ca.nodeType)) && (!W || v(ca))) ba.push(ca)
		});
		return ba
	}

	function s(b) {
		return "[" + (typeof b.getName == "undefined" ? "Range" : b.getName()) + "(" + k.inspectNode(b.startContainer) +
			":" + b.startOffset + ", " + k.inspectNode(b.endContainer) + ":" + b.endOffset + ")]"
	}

	function q(b, h) {
		this.range = b;
		this.clonePartiallySelectedTextNodes = h;
		if (!b.collapsed) {
			this.sc = b.startContainer;
			this.so = b.startOffset;
			this.ec = b.endContainer;
			this.eo = b.endOffset;
			var v = b.commonAncestorContainer;
			if (this.sc === this.ec && k.isCharacterDataNode(this.sc)) {
				this.isSingleCharacterDataNode = true;
				this._first = this._last = this._next = this.sc
			} else {
				this._first = this._next = this.sc === v && !k.isCharacterDataNode(this.sc) ? this.sc.childNodes[this.so] :
					k.getClosestAncestorIn(this.sc, v, true);
				this._last = this.ec === v && !k.isCharacterDataNode(this.ec) ? this.ec.childNodes[this.eo - 1] : k.getClosestAncestorIn(
					this.ec, v, true)
			}
		}
	}

	function d(b) {
		this.code = this[b];
		this.codeName = b;
		this.message = "RangeException: " + this.codeName
	}

	function f(b, h, v) {
		this.nodes = B(b, h, v);
		this._next = this.nodes[0];
		this._position = 0
	}

	function i(b) {
		return function(h, v) {
			for (var y, M = v ? h : h.parentNode; M;) {
				y = M.nodeType;
				if (k.arrayContains(b, y)) return M;
				M = M.parentNode
			}
			return null
		}
	}

	function u(b) {
		for (var h; h =
			b.parentNode;) b = h;
		return b
	}

	function n(b, h) {
		if (C(b, h)) throw new d("INVALID_NODE_TYPE_ERR");
	}

	function r(b) {
		if (!b.startContainer) throw new S("INVALID_STATE_ERR");
	}

	function A(b, h) {
		if (!k.arrayContains(h, b.nodeType)) throw new d("INVALID_NODE_TYPE_ERR");
	}

	function O(b, h) {
		if (h < 0 || h > (k.isCharacterDataNode(b) ? b.length : b.childNodes.length)) throw new S("INDEX_SIZE_ERR");
	}

	function R(b, h) {
		if (e(b, true) !== e(h, true)) throw new S("WRONG_DOCUMENT_ERR");
	}

	function T(b) {
		if (l(b, true)) throw new S("NO_MODIFICATION_ALLOWED_ERR");
	}

	function F(b, h) {
		if (!b) throw new S(h);
	}

	function G(b) {
		if (!e(b.startContainer, true) || !e(b.endContainer, true) || !(b.startOffset <= (k.isCharacterDataNode(b.startContainer) ?
				b.startContainer.length : b.startContainer.childNodes.length)) || !(b.endOffset <= (k.isCharacterDataNode(b.endContainer) ?
				b.endContainer.length : b.endContainer.childNodes.length))) throw Error(
			"Range Range error: Range is no longer valid after DOM mutation (" + b.inspect() + ")");
	}

	function X(b) {
		b.START_TO_START = P;
		b.START_TO_END = Y;
		b.END_TO_END = ka;
		b.END_TO_START = la;
		b.NODE_BEFORE = ma;
		b.NODE_AFTER = na;
		b.NODE_BEFORE_AND_AFTER = oa;
		b.NODE_INSIDE = ja
	}

	function da(b) {
		X(b);
		X(b.prototype)
	}

	function ga(b, h, v) {
		function y(c, g) {
			return function(p) {
				r(this);
				A(p, $);
				A(u(p), ia);
				p = (c ? x : D)(p);
				(g ? M : W)(this, p.node, p.offset)
			}
		}

		function M(c, g, p) {
			var z = c.endContainer,
				L = c.endOffset;
			if (g !== c.startContainer || p !== this.startOffset) {
				if (u(g) != u(z) || k.comparePoints(g, p, z, L) == 1) {
					z = g;
					L = p
				}
				h(c, g, p, z, L)
			}
		}

		function W(c, g, p) {
			var z = c.startContainer,
				L = c.startOffset;
			if (g !== c.endContainer || p !==
				this.endOffset) {
				if (u(g) != u(z) || k.comparePoints(g, p, z, L) == -1) {
					z = g;
					L = p
				}
				h(c, z, L, g, p)
			}
		}

		function ba(c, g, p) {
			if (g !== c.startContainer || p !== this.startOffset || g !== c.endContainer || p !== this.endOffset) h(c, g, p, g,
				p)
		}

		function ca(c) {
			return function() {
				r(this);
				G(this);
				var g = this.startContainer,
					p = this.startOffset,
					z = this.commonAncestorContainer,
					L = new q(this, true);
				if (g !== z) {
					g = k.getClosestAncestorIn(g, z, true);
					p = D(g);
					g = p.node;
					p = p.offset
				}
				o(L, T);
				L.reset();
				z = c(L);
				L.detach();
				h(this, g, p, g, p);
				return z
			}
		}
		b.prototype = {
			attachListener: function(c,
				g) {
				this._listeners[c].push(g)
			},
			setStart: function(c, g) {
				r(this);
				n(c, true);
				O(c, g);
				M(this, c, g)
			},
			setEnd: function(c, g) {
				r(this);
				n(c, true);
				O(c, g);
				W(this, c, g)
			},
			setStartBefore: y(true, true),
			setStartAfter: y(false, true),
			setEndBefore: y(true, false),
			setEndAfter: y(false, false),
			collapse: function(c) {
				r(this);
				G(this);
				c ? h(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset) : h(this, this.endContainer,
					this.endOffset, this.endContainer, this.endOffset)
			},
			selectNodeContents: function(c) {
				r(this);
				n(c, true);
				h(this, c, 0, c, J(c))
			},
			selectNode: function(c) {
				r(this);
				n(c, false);
				A(c, $);
				var g = x(c);
				c = D(c);
				h(this, g.node, g.offset, c.node, c.offset)
			},
			compareBoundaryPoints: function(c, g) {
				r(this);
				G(this);
				R(this.startContainer, g.startContainer);
				var p = c == la || c == P ? "start" : "end",
					z = c == Y || c == P ? "start" : "end";
				return k.comparePoints(this[p + "Container"], this[p + "Offset"], g[z + "Container"], g[z + "Offset"])
			},
			insertNode: function(c) {
				r(this);
				G(this);
				A(c, aa);
				T(this.startContainer);
				if (k.isAncestorOf(c, this.startContainer, true)) throw new S("HIERARCHY_REQUEST_ERR");
				this.setStartBefore(Q(c, this.startContainer, this.startOffset))
			},
			cloneContents: function() {
				r(this);
				G(this);
				var c, g;
				if (this.collapsed) return I(this).createDocumentFragment();
				else {
					if (this.startContainer === this.endContainer && k.isCharacterDataNode(this.startContainer)) {
						c = this.startContainer.cloneNode(true);
						c.data = c.data.slice(this.startOffset, this.endOffset);
						g = I(this).createDocumentFragment();
						g.appendChild(c);
						return g
					} else {
						g = new q(this, true);
						c = j(g);
						g.detach()
					}
					return c
				}
			},
			extractContents: ca(w),
			deleteContents: ca(t),
			canSurroundContents: function() {
				r(this);
				G(this);
				T(this.startContainer);
				T(this.endContainer);
				var c = new q(this, true),
					g = c._first && N(c._first, this) || c._last && N(c._last, this);
				c.detach();
				return !g
			},
			surroundContents: function(c) {
				A(c, a);
				if (!this.canSurroundContents()) throw new d("BAD_BOUNDARYPOINTS_ERR");
				var g = this.extractContents();
				if (c.hasChildNodes())
					for (; c.lastChild;) c.removeChild(c.lastChild);
				Q(c, this.startContainer, this.startOffset);
				c.appendChild(g);
				this.selectNode(c)
			},
			cloneRange: function() {
				r(this);
				G(this);
				for (var c = new K(I(this)), g = H.length, p; g--;) {
					p = H[g];
					c[p] = this[p]
				}
				return c
			},
			detach: function() {
				v(this)
			},
			toString: function() {
				r(this);
				G(this);
				var c = this.startContainer;
				if (c === this.endContainer && k.isCharacterDataNode(c)) return c.nodeType == 3 || c.nodeType == 4 ? c.data.slice(
					this.startOffset, this.endOffset) : "";
				else {
					var g = [];
					c = new q(this, true);
					o(c, function(p) {
						if (p.nodeType == 3 || p.nodeType == 4) g.push(p.data)
					});
					c.detach();
					return g.join("")
				}
			},
			compareNode: function(c) {
				r(this);
				G(this);
				var g = c.parentNode,
					p = k.getNodeIndex(c);
				if (!g) throw new S("NOT_FOUND_ERR");
				c = this.comparePoint(g, p);
				g = this.comparePoint(g, p + 1);
				return c < 0 ? g > 0 ? oa : ma : g > 0 ? na : ja
			},
			comparePoint: function(c, g) {
				r(this);
				G(this);
				F(c, "HIERARCHY_REQUEST_ERR");
				R(c, this.startContainer);
				if (k.comparePoints(c, g, this.startContainer, this.startOffset) < 0) return -1;
				else if (k.comparePoints(c, g, this.endContainer, this.endOffset) > 0) return 1;
				return 0
			},
			createContextualFragment: function(c) {
				r(this);
				var g = I(this),
					p = g.createElement("div");
				p.innerHTML = c;
				for (c = g.createDocumentFragment(); g =
					p.firstChild;) c.appendChild(g);
				return c
			},
			intersectsNode: function(c, g) {
				r(this);
				G(this);
				F(c, "NOT_FOUND_ERR");
				if (k.getDocument(c) !== I(this)) return false;
				var p = c.parentNode,
					z = k.getNodeIndex(c);
				F(p, "NOT_FOUND_ERR");
				var L = k.comparePoints(p, z, this.endContainer, this.endOffset);
				p = k.comparePoints(p, z + 1, this.startContainer, this.startOffset);
				return g ? L <= 0 && p >= 0 : L < 0 && p > 0
			},
			isPointInRange: function(c, g) {
				r(this);
				G(this);
				F(c, "HIERARCHY_REQUEST_ERR");
				R(c, this.startContainer);
				return k.comparePoints(c, g, this.startContainer,
					this.startOffset) >= 0 && k.comparePoints(c, g, this.endContainer, this.endOffset) <= 0
			},
			intersectsRange: function(c) {
				r(this);
				G(this);
				if (I(c) != I(this)) throw new S("WRONG_DOCUMENT_ERR");
				return k.comparePoints(this.startContainer, this.startOffset, c.endContainer, c.endOffset) < 0 && k.comparePoints(
					this.endContainer, this.endOffset, c.startContainer, c.startOffset) > 0
			},
			intersection: function(c) {
				if (this.intersectsRange(c)) {
					var g = k.comparePoints(this.startContainer, this.startOffset, c.startContainer, c.startOffset),
						p = k.comparePoints(this.endContainer,
							this.endOffset, c.endContainer, c.endOffset),
						z = this.cloneRange();
					g == -1 && z.setStart(c.startContainer, c.startOffset);
					p == 1 && z.setEnd(c.endContainer, c.endOffset);
					return z
				}
				return null
			},
			containsNode: function(c, g) {
				return g ? this.intersectsNode(c, false) : this.compareNode(c) == ja
			},
			containsNodeContents: function(c) {
				return this.comparePoint(c, 0) >= 0 && this.comparePoint(c, J(c)) <= 0
			},
			splitBoundaries: function() {
				r(this);
				G(this);
				var c = this.startContainer,
					g = this.startOffset,
					p = this.endContainer,
					z = this.endOffset,
					L = c === p;
				k.isCharacterDataNode(p) &&
					z > 0 && z < p.length && k.splitDataNode(p, z);
				if (k.isCharacterDataNode(c) && g > 0 && g < c.length) {
					c = k.splitDataNode(c, g);
					if (L) {
						z -= g;
						p = c
					}
					g = 0
				}
				h(this, c, g, p, z)
			},
			normalizeBoundaries: function() {
				r(this);
				G(this);
				var c = this.startContainer,
					g = this.startOffset,
					p = this.endContainer,
					z = this.endOffset,
					L = function(V) {
						var U = V.nextSibling;
						if (U && U.nodeType == V.nodeType) {
							p = V;
							z = V.length;
							V.appendData(U.data);
							U.parentNode.removeChild(U)
						}
					},
					pa = function(V) {
						var U = V.previousSibling;
						if (U && U.nodeType == V.nodeType) {
							c = V;
							g = U.length;
							V.insertData(0,
								U.data);
							U.parentNode.removeChild(U);
							if (c == p) {
								z += g;
								p = c
							}
						}
					},
					ha = true;
				if (k.isCharacterDataNode(p)) p.length == z && L(p);
				else {
					if (z > 0)(ha = p.childNodes[z - 1]) && k.isCharacterDataNode(ha) && L(ha);
					ha = !this.collapsed
				}
				if (ha)
					if (k.isCharacterDataNode(c)) g == 0 && pa(c);
					else {
						if (g < c.childNodes.length)(L = c.childNodes[g]) && k.isCharacterDataNode(L) && pa(L)
					}
				else {
					c = p;
					g = z
				}
				h(this, c, g, p, z)
			},
			createNodeIterator: function(c, g) {
				r(this);
				G(this);
				return new f(this, c, g)
			},
			getNodes: function(c, g) {
				r(this);
				G(this);
				return B(this, c, g)
			},
			collapseToPoint: function(c,
				g) {
				r(this);
				G(this);
				n(c, true);
				O(c, g);
				ba(this, c, g)
			},
			collapseBefore: function(c) {
				r(this);
				this.setEndBefore(c);
				this.collapse(false)
			},
			collapseAfter: function(c) {
				r(this);
				this.setStartAfter(c);
				this.collapse(true)
			},
			getName: function() {
				return "DomRange"
			},
			equals: function(c) {
				return K.rangesEqual(this, c)
			},
			inspect: function() {
				return s(this)
			}
		};
		da(b)
	}

	function ea(b) {
		b.collapsed = b.startContainer === b.endContainer && b.startOffset === b.endOffset;
		b.commonAncestorContainer = b.collapsed ? b.startContainer : k.getCommonAncestor(b.startContainer,
			b.endContainer)
	}

	function fa(b, h, v, y, M) {
		var W = b.startContainer !== h || b.startOffset !== v,
			ba = b.endContainer !== y || b.endOffset !== M;
		b.startContainer = h;
		b.startOffset = v;
		b.endContainer = y;
		b.endOffset = M;
		ea(b);
		E(b, "boundarychange", {
			startMoved: W,
			endMoved: ba
		})
	}

	function K(b) {
		this.startContainer = b;
		this.startOffset = 0;
		this.endContainer = b;
		this.endOffset = 0;
		this._listeners = {
			boundarychange: [],
			detach: []
		};
		ea(this)
	}
	m.requireModules(["DomUtil"]);
	var k = m.dom,
		Z = k.DomPosition,
		S = m.DOMException;
	q.prototype = {
		_current: null,
		_next: null,
		_first: null,
		_last: null,
		isSingleCharacterDataNode: false,
		reset: function() {
			this._current = null;
			this._next = this._first
		},
		hasNext: function() {
			return !!this._next
		},
		next: function() {
			var b = this._current = this._next;
			if (b) {
				this._next = b !== this._last ? b.nextSibling : null;
				if (k.isCharacterDataNode(b) && this.clonePartiallySelectedTextNodes) {
					if (b === this.ec)(b = b.cloneNode(true)).deleteData(this.eo, b.length - this.eo);
					if (this._current === this.sc)(b = b.cloneNode(true)).deleteData(0, this.so)
				}
			}
			return b
		},
		remove: function() {
			var b = this._current,
				h, v;
			if (k.isCharacterDataNode(b) && (b === this.sc || b === this.ec)) {
				h = b === this.sc ? this.so : 0;
				v = b === this.ec ? this.eo : b.length;
				h != v && b.deleteData(h, v - h)
			} else b.parentNode && b.parentNode.removeChild(b)
		},
		isPartiallySelectedSubtree: function() {
			return N(this._current, this.range)
		},
		getSubtreeIterator: function() {
			var b;
			if (this.isSingleCharacterDataNode) {
				b = this.range.cloneRange();
				b.collapse()
			} else {
				b = new K(I(this.range));
				var h = this._current,
					v = h,
					y = 0,
					M = h,
					W = J(h);
				if (k.isAncestorOf(h, this.sc, true)) {
					v = this.sc;
					y = this.so
				}
				if (k.isAncestorOf(h,
						this.ec, true)) {
					M = this.ec;
					W = this.eo
				}
				fa(b, v, y, M, W)
			}
			return new q(b, this.clonePartiallySelectedTextNodes)
		},
		detach: function(b) {
			b && this.range.detach();
			this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo =
				null
		}
	};
	d.prototype = {
		BAD_BOUNDARYPOINTS_ERR: 1,
		INVALID_NODE_TYPE_ERR: 2
	};
	d.prototype.toString = function() {
		return this.message
	};
	f.prototype = {
		_current: null,
		hasNext: function() {
			return !!this._next
		},
		next: function() {
			this._current = this._next;
			this._next = this.nodes[++this._position];
			return this._current
		},
		detach: function() {
			this._current = this._next = this.nodes = null
		}
	};
	var $ = [1, 3, 4, 5, 7, 8, 10],
		ia = [2, 9, 11],
		aa = [1, 3, 4, 5, 7, 8, 10, 11],
		a = [1, 3, 4, 5, 7, 8],
		e = i([9, 11]),
		l = i([5, 6, 10, 12]),
		C = i([6, 10, 12]),
		H = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"],
		P = 0,
		Y = 1,
		ka = 2,
		la = 3,
		ma = 0,
		na = 1,
		oa = 2,
		ja = 3;
	ga(K, fa, function(b) {
		r(b);
		b.startContainer = b.startOffset = b.endContainer = b.endOffset = null;
		b.collapsed = b.commonAncestorContainer = null;
		E(b, "detach", null);
		b._listeners =
			null
	});
	K.fromRange = function(b) {
		var h = new K(I(b));
		fa(h, b.startContainer, b.startOffset, b.endContainer, b.endOffset);
		return h
	};
	K.rangeProperties = H;
	K.RangeIterator = q;
	K.copyComparisonConstants = da;
	K.createPrototypeRange = ga;
	K.inspect = s;
	K.getRangeDocument = I;
	K.rangesEqual = function(b, h) {
		return b.startContainer === h.startContainer && b.startOffset === h.startOffset && b.endContainer === h.endContainer &&
			b.endOffset === h.endOffset
	};
	K.getEndOffset = J;
	m.DomRange = K;
	m.RangeException = d
});
rangy.createModule("WrappedRange", function(m) {
	function N(j, o, t, w) {
		var B = j.duplicate();
		B.collapse(t);
		var s = B.parentElement();
		x.isAncestorOf(o, s, true) || (s = o);
		if (!s.canHaveHTML) return new D(s.parentNode, x.getNodeIndex(s));
		o = x.getDocument(s).createElement("span");
		var q, d = t ? "StartToStart" : "StartToEnd";
		do {
			s.insertBefore(o, o.previousSibling);
			B.moveToElementText(o)
		} while ((q = B.compareEndPoints(d, j)) > 0 && o.previousSibling);
		d = o.nextSibling;
		if (q == -1 && d && x.isCharacterDataNode(d)) {
			B.setEndPoint(t ? "EndToStart" : "EndToEnd",
				j);
			if (/[\r\n]/.test(d.data)) {
				s = B.duplicate();
				t = s.text.replace(/\r\n/g, "\r").length;
				for (t = s.moveStart("character", t); s.compareEndPoints("StartToEnd", s) == -1;) {
					t++;
					s.moveStart("character", 1)
				}
			} else t = B.text.length;
			s = new D(d, t)
		} else {
			d = (w || !t) && o.previousSibling;
			s = (t = (w || t) && o.nextSibling) && x.isCharacterDataNode(t) ? new D(t, 0) : d && x.isCharacterDataNode(d) ?
				new D(d, d.length) : new D(s, x.getNodeIndex(o))
		}
		o.parentNode.removeChild(o);
		return s
	}

	function I(j, o) {
		var t, w, B = j.offset,
			s = x.getDocument(j.node),
			q = s.body.createTextRange(),
			d = x.isCharacterDataNode(j.node);
		if (d) {
			t = j.node;
			w = t.parentNode
		} else {
			t = j.node.childNodes;
			t = B < t.length ? t[B] : null;
			w = j.node
		}
		s = s.createElement("span");
		s.innerHTML = "&#feff;";
		t ? w.insertBefore(s, t) : w.appendChild(s);
		q.moveToElementText(s);
		q.collapse(!o);
		w.removeChild(s);
		if (d) q[o ? "moveStart" : "moveEnd"]("character", B);
		return q
	}
	m.requireModules(["DomUtil", "DomRange"]);
	var E, x = m.dom,
		D = x.DomPosition,
		J = m.DomRange;
	if (m.features.implementsDomRange)(function() {
		function j(f) {
			for (var i = t.length, u; i--;) {
				u = t[i];
				f[u] = f.nativeRange[u]
			}
		}
		var o, t = J.rangeProperties,
			w, B;
		E = function(f) {
			if (!f) throw Error("Range must be specified");
			this.nativeRange = f;
			j(this)
		};
		J.createPrototypeRange(E, function(f, i, u, n, r) {
			var A = f.endContainer !== n || f.endOffset != r;
			if (f.startContainer !== i || f.startOffset != u || A) {
				f.setEnd(n, r);
				f.setStart(i, u)
			}
		}, function(f) {
			f.nativeRange.detach();
			f.detached = true;
			for (var i = t.length, u; i--;) {
				u = t[i];
				f[u] = null
			}
		});
		o = E.prototype;
		o.selectNode = function(f) {
			this.nativeRange.selectNode(f);
			j(this)
		};
		o.deleteContents = function() {
			this.nativeRange.deleteContents();
			j(this)
		};
		o.extractContents = function() {
			var f = this.nativeRange.extractContents();
			j(this);
			return f
		};
		o.cloneContents = function() {
			return this.nativeRange.cloneContents()
		};
		o.surroundContents = function(f) {
			this.nativeRange.surroundContents(f);
			j(this)
		};
		o.collapse = function(f) {
			this.nativeRange.collapse(f);
			j(this)
		};
		o.cloneRange = function() {
			return new E(this.nativeRange.cloneRange())
		};
		o.refresh = function() {
			j(this)
		};
		o.toString = function() {
			return this.nativeRange.toString()
		};
		var s = document.createTextNode("test");
		x.getBody(document).appendChild(s);
		var q = document.createRange();
		q.setStart(s, 0);
		q.setEnd(s, 0);
		try {
			q.setStart(s, 1);
			w = true;
			o.setStart = function(f, i) {
				this.nativeRange.setStart(f, i);
				j(this)
			};
			o.setEnd = function(f, i) {
				this.nativeRange.setEnd(f, i);
				j(this)
			};
			B = function(f) {
				return function(i) {
					this.nativeRange[f](i);
					j(this)
				}
			}
		} catch (d) {
			w = false;
			o.setStart = function(f, i) {
				try {
					this.nativeRange.setStart(f, i)
				} catch (u) {
					this.nativeRange.setEnd(f, i);
					this.nativeRange.setStart(f, i)
				}
				j(this)
			};
			o.setEnd = function(f, i) {
				try {
					this.nativeRange.setEnd(f, i)
				} catch (u) {
					this.nativeRange.setStart(f,
						i);
					this.nativeRange.setEnd(f, i)
				}
				j(this)
			};
			B = function(f, i) {
				return function(u) {
					try {
						this.nativeRange[f](u)
					} catch (n) {
						this.nativeRange[i](u);
						this.nativeRange[f](u)
					}
					j(this)
				}
			}
		}
		o.setStartBefore = B("setStartBefore", "setEndBefore");
		o.setStartAfter = B("setStartAfter", "setEndAfter");
		o.setEndBefore = B("setEndBefore", "setStartBefore");
		o.setEndAfter = B("setEndAfter", "setStartAfter");
		q.selectNodeContents(s);
		o.selectNodeContents = q.startContainer == s && q.endContainer == s && q.startOffset == 0 && q.endOffset == s.length ?
			function(f) {
				this.nativeRange.selectNodeContents(f);
				j(this)
			} : function(f) {
				this.setStart(f, 0);
				this.setEnd(f, J.getEndOffset(f))
			};
		q.selectNodeContents(s);
		q.setEnd(s, 3);
		w = document.createRange();
		w.selectNodeContents(s);
		w.setEnd(s, 4);
		w.setStart(s, 2);
		o.compareBoundaryPoints = q.compareBoundaryPoints(q.START_TO_END, w) == -1 & q.compareBoundaryPoints(q.END_TO_START,
			w) == 1 ? function(f, i) {
			i = i.nativeRange || i;
			if (f == i.START_TO_END) f = i.END_TO_START;
			else if (f == i.END_TO_START) f = i.START_TO_END;
			return this.nativeRange.compareBoundaryPoints(f, i)
		} : function(f, i) {
			return this.nativeRange.compareBoundaryPoints(f,
				i.nativeRange || i)
		};
		x.getBody(document).removeChild(s);
		q.detach();
		w.detach()
	})();
	else if (m.features.implementsTextRange) {
		E = function(j) {
			this.textRange = j;
			this.refresh()
		};
		E.prototype = new J(document);
		E.prototype.refresh = function() {
			var j, o, t = this.textRange;
			j = t.parentElement();
			var w = t.duplicate();
			w.collapse(true);
			o = w.parentElement();
			w = t.duplicate();
			w.collapse(false);
			t = w.parentElement();
			o = o == t ? o : x.getCommonAncestor(o, t);
			o = o == j ? o : x.getCommonAncestor(j, o);
			if (this.textRange.compareEndPoints("StartToEnd", this.textRange) ==
				0) o = j = N(this.textRange, o, true, true);
			else {
				j = N(this.textRange, o, true, false);
				o = N(this.textRange, o, false, false)
			}
			this.setStart(j.node, j.offset);
			this.setEnd(o.node, o.offset)
		};
		E.rangeToTextRange = function(j) {
			if (j.collapsed) return I(new D(j.startContainer, j.startOffset), true);
			else {
				var o = I(new D(j.startContainer, j.startOffset), true),
					t = I(new D(j.endContainer, j.endOffset), false);
				j = x.getDocument(j.startContainer).body.createTextRange();
				j.setEndPoint("StartToStart", o);
				j.setEndPoint("EndToEnd", t);
				return j
			}
		};
		J.copyComparisonConstants(E);
		var Q = function() {
			return this
		}();
		if (typeof Q.Range == "undefined") Q.Range = E
	}
	E.prototype.getName = function() {
		return "WrappedRange"
	};
	m.WrappedRange = E;
	m.createNativeRange = function(j) {
		j = j || document;
		if (m.features.implementsDomRange) return j.createRange();
		else if (m.features.implementsTextRange) return j.body.createTextRange()
	};
	m.createRange = function(j) {
		j = j || document;
		return new E(m.createNativeRange(j))
	};
	m.createRangyRange = function(j) {
		j = j || document;
		return new J(j)
	};
	m.createIframeRange = function(j) {
		return m.createRange(x.getIframeDocument(j))
	};
	m.createIframeRangyRange = function(j) {
		return m.createRangyRange(x.getIframeDocument(j))
	};
	m.addCreateMissingNativeApiListener(function(j) {
		j = j.document;
		if (typeof j.createRange == "undefined") j.createRange = function() {
			return m.createRange(this)
		};
		j = j = null
	})
});
rangy.createModule("WrappedSelection", function(m, N) {
	function I(a) {
		return (a || window).getSelection()
	}

	function E(a) {
		return (a || window).document.selection
	}

	function x(a, e, l) {
		var C = l ? "end" : "start";
		l = l ? "start" : "end";
		a.anchorNode = e[C + "Container"];
		a.anchorOffset = e[C + "Offset"];
		a.focusNode = e[l + "Container"];
		a.focusOffset = e[l + "Offset"]
	}

	function D(a) {
		a.anchorNode = a.focusNode = null;
		a.anchorOffset = a.focusOffset = 0;
		a.rangeCount = 0;
		a.isCollapsed = true;
		a._ranges.length = 0
	}

	function J(a) {
		var e;
		if (a instanceof i) {
			e = a._selectionNativeRange;
			if (!e) {
				e = m.createNativeRange(d.getDocument(a.startContainer));
				e.setEnd(a.endContainer, a.endOffset);
				e.setStart(a.startContainer, a.startOffset);
				a._selectionNativeRange = e;
				a.attachListener("detach", function() {
					this._selectionNativeRange = null
				})
			}
		} else if (a instanceof u) e = a.nativeRange;
		else if (window.Range && a instanceof Range) e = a;
		return e
	}

	function Q(a) {
		var e = a.getNodes(),
			l;
		a: if (!e.length || e[0].nodeType != 1) l = false;
			else {
				l = 1;
				for (var C = e.length; l < C; ++l)
					if (!d.isAncestorOf(e[0], e[l])) {
						l = false;
						break a
					} l = true
			}
		if (!l) throw Error("getSingleElementFromRange: range " +
			a.inspect() + " did not consist of a single element");
		return e[0]
	}

	function j(a, e) {
		var l = new u(e);
		a._ranges = [l];
		x(a, l, false);
		a.rangeCount = 1;
		a.isCollapsed = l.collapsed
	}

	function o(a) {
		a._ranges.length = 0;
		if (a.docSelection.type == "None") D(a);
		else {
			var e = a.docSelection.createRange();
			if (e && typeof e.text != "undefined") j(a, e);
			else {
				a.rangeCount = e.length;
				for (var l, C = d.getDocument(e.item(0)), H = 0; H < a.rangeCount; ++H) {
					l = m.createRange(C);
					l.selectNode(e.item(H));
					a._ranges.push(l)
				}
				a.isCollapsed = a.rangeCount == 1 && a._ranges[0].collapsed;
				x(a, a._ranges[a.rangeCount - 1], false)
			}
		}
	}

	function t(a, e) {
		var l = a.docSelection.createRange(),
			C = Q(e),
			H = d.getDocument(l.item(0));
		H = d.getBody(H).createControlRange();
		for (var P = 0, Y = l.length; P < Y; ++P) H.add(l.item(P));
		try {
			H.add(C)
		} catch (ka) {
			throw Error(
				"addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
		}
		H.select();
		o(a)
	}

	function w(a, e) {
		this.nativeSelection = a;
		this.docSelection = e;
		this._ranges = [];
		this.refresh()
	}

	function B(a, e) {
		var l = d.getDocument(e[0].startContainer);
		l = d.getBody(l).createControlRange();
		for (var C = 0, H; C < rangeCount; ++C) {
			H = Q(e[C]);
			try {
				l.add(H)
			} catch (P) {
				throw Error(
					"setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)"
				);
			}
		}
		l.select();
		o(a)
	}

	function s(a, e) {
		if (a.anchorNode && d.getDocument(a.anchorNode) !== d.getDocument(e)) throw new n("WRONG_DOCUMENT_ERR");
	}

	function q(a) {
		var e = [],
			l = new r(a.anchorNode, a.anchorOffset),
			C = new r(a.focusNode, a.focusOffset),
			H = typeof a.getName == "function" ? a.getName() :
			"Selection";
		if (typeof a.rangeCount != "undefined")
			for (var P = 0, Y = a.rangeCount; P < Y; ++P) e[P] = i.inspect(a.getRangeAt(P));
		return "[" + H + "(Ranges: " + e.join(", ") + ")(anchor: " + l.inspect() + ", focus: " + C.inspect() + "]"
	}
	m.requireModules(["DomUtil", "DomRange", "WrappedRange"]);
	m.config.checkSelectionRanges = true;
	var d = m.dom,
		f = m.util,
		i = m.DomRange,
		u = m.WrappedRange,
		n = m.DOMException,
		r = d.DomPosition,
		A, O, R = m.util.isHostMethod(window, "getSelection"),
		T = m.util.isHostObject(document, "selection");
	if (R) A = I;
	else if (T) A = E;
	else N.fail("No means of obtaining a selection object");
	m.getNativeSelection = A;
	var F = A();
	R = m.createNativeRange(document);
	var G = d.getBody(document),
		X = f.areHostObjects(F, f.areHostProperties(F, ["anchorOffset", "focusOffset"]));
	m.features.selectionHasAnchorAndFocus = X;
	var da = f.isHostMethod(F, "extend");
	m.features.selectionHasExtend = da;
	var ga = typeof F.rangeCount == "number";
	m.features.selectionHasRangeCount = ga;
	var ea = false,
		fa = true;
	f.areHostMethods(F, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof F.rangeCount == "number" && m.features.implementsDomRange &&
		function() {
			var a =
				G.appendChild(document.createTextNode("One")),
				e = G.appendChild(document.createTextNode("Two")),
				l = m.createNativeRange(document);
			l.selectNodeContents(a);
			var C = m.createNativeRange(document);
			C.selectNodeContents(e);
			F.removeAllRanges();
			F.addRange(l);
			F.addRange(C);
			ea = F.rangeCount == 2;
			F.removeAllRanges();
			a.parentNode.removeChild(a);
			e.parentNode.removeChild(e);
			a = document.createElement("p");
			a.contentEditable = false;
			e = a.appendChild(document.createTextNode("test"));
			G.appendChild(a);
			l = m.createRange();
			l.collapseToPoint(e,
				1);
			F.addRange(l.nativeRange);
			fa = F.rangeCount == 1;
			F.removeAllRanges();
			G.removeChild(a)
		}();
	m.features.selectionSupportsMultipleRanges = ea;
	m.features.collapsedNonEditableSelectionsSupported = fa;
	var K = false,
		k;
	if (G && f.isHostMethod(G, "createControlRange")) {
		k = G.createControlRange();
		if (f.areHostProperties(k, ["item", "add"])) K = true
	}
	m.features.implementsControlRange = K;
	O = X ? function(a) {
		return a.anchorNode === a.focusNode && a.anchorOffset === a.focusOffset
	} : function(a) {
		return a.rangeCount ? a.getRangeAt(a.rangeCount - 1).collapsed :
			false
	};
	var Z;
	if (f.isHostMethod(F, "getRangeAt")) Z = function(a, e) {
		try {
			return a.getRangeAt(e)
		} catch (l) {
			return null
		}
	};
	else if (X) Z = function(a) {
		var e = d.getDocument(a.anchorNode);
		e = m.createRange(e);
		e.setStart(a.anchorNode, a.anchorOffset);
		e.setEnd(a.focusNode, a.focusOffset);
		if (e.collapsed !== this.isCollapsed) {
			e.setStart(a.focusNode, a.focusOffset);
			e.setEnd(a.anchorNode, a.anchorOffset)
		}
		return e
	};
	m.getSelection = function(a) {
		a = a || window;
		var e = a._rangySelection,
			l = A(a),
			C = T ? E(a) : null;
		if (e) {
			e.nativeSelection = l;
			e.docSelection =
				C;
			e.refresh()
		} else {
			e = new w(l, C);
			a._rangySelection = e
		}
		return e
	};
	m.getIframeSelection = function(a) {
		return m.getSelection(d.getIframeWindow(a))
	};
	k = w.prototype;
	if (X && f.areHostMethods(F, ["removeAllRanges", "addRange"])) {
		k.removeAllRanges = function() {
			this.nativeSelection.removeAllRanges();
			D(this)
		};
		var S = function(a, e) {
			var l = i.getRangeDocument(e);
			l = m.createRange(l);
			l.collapseToPoint(e.endContainer, e.endOffset);
			a.nativeSelection.addRange(J(l));
			a.nativeSelection.extend(e.startContainer, e.startOffset);
			a.refresh()
		};
		k.addRange = ga ? function(a, e) {
				if (K && T && this.docSelection.type == "Control") t(this, a);
				else if (e && da) S(this, a);
				else {
					var l;
					if (ea) l = this.rangeCount;
					else {
						this.removeAllRanges();
						l = 0
					}
					this.nativeSelection.addRange(J(a));
					this.rangeCount = this.nativeSelection.rangeCount;
					if (this.rangeCount == l + 1) {
						if (m.config.checkSelectionRanges)
							if ((l = Z(this.nativeSelection, this.rangeCount - 1)) && !i.rangesEqual(l, a)) a = new u(l);
						this._ranges[this.rangeCount - 1] = a;
						x(this, a, aa(this.nativeSelection));
						this.isCollapsed = O(this)
					} else this.refresh()
				}
			} :
			function(a, e) {
				if (e && da) S(this, a);
				else {
					this.nativeSelection.addRange(J(a));
					this.refresh()
				}
			};
		k.setRanges = function(a) {
			if (K && a.length > 1) B(this, a);
			else {
				this.removeAllRanges();
				for (var e = 0, l = a.length; e < l; ++e) this.addRange(a[e])
			}
		}
	} else if (f.isHostMethod(F, "empty") && f.isHostMethod(R, "select") && K && T) {
		k.removeAllRanges = function() {
			try {
				this.docSelection.empty();
				if (this.docSelection.type != "None") {
					var a;
					if (this.anchorNode) a = d.getDocument(this.anchorNode);
					else if (this.docSelection.type == "Control") {
						var e = this.docSelection.createRange();
						if (e.length) a = d.getDocument(e.item(0)).body.createTextRange()
					}
					if (a) {
						a.body.createTextRange().select();
						this.docSelection.empty()
					}
				}
			} catch (l) {}
			D(this)
		};
		k.addRange = function(a) {
			if (this.docSelection.type == "Control") t(this, a);
			else {
				u.rangeToTextRange(a).select();
				this._ranges[0] = a;
				this.rangeCount = 1;
				this.isCollapsed = this._ranges[0].collapsed;
				x(this, a, false)
			}
		};
		k.setRanges = function(a) {
			this.removeAllRanges();
			var e = a.length;
			if (e > 1) B(this, a);
			else e && this.addRange(a[0])
		}
	} else {
		N.fail("No means of selecting a Range or TextRange was found");
		return false
	}
	k.getRangeAt = function(a) {
		if (a < 0 || a >= this.rangeCount) throw new n("INDEX_SIZE_ERR");
		else return this._ranges[a]
	};
	var $;
	if (f.isHostMethod(F, "getRangeAt") && typeof F.rangeCount == "number") $ = function(a) {
		if (K && T && a.docSelection.type == "Control") o(a);
		else {
			a._ranges.length = a.rangeCount = a.nativeSelection.rangeCount;
			if (a.rangeCount) {
				for (var e = 0, l = a.rangeCount; e < l; ++e) a._ranges[e] = new m.WrappedRange(a.nativeSelection.getRangeAt(e));
				x(a, a._ranges[a.rangeCount - 1], aa(a.nativeSelection));
				a.isCollapsed =
					O(a)
			} else D(a)
		}
	};
	else if (X && typeof F.isCollapsed == "boolean" && typeof R.collapsed == "boolean" && m.features.implementsDomRange)
		$ = function(a) {
			var e;
			e = a.nativeSelection;
			if (e.anchorNode) {
				e = Z(e, 0);
				a._ranges = [e];
				a.rangeCount = 1;
				e = a.nativeSelection;
				a.anchorNode = e.anchorNode;
				a.anchorOffset = e.anchorOffset;
				a.focusNode = e.focusNode;
				a.focusOffset = e.focusOffset;
				a.isCollapsed = O(a)
			} else D(a)
		};
	else if (f.isHostMethod(F, "createRange") && T) $ = function(a) {
		var e = a.docSelection.createRange();
		if (a.docSelection.type == "Control") o(a);
		else e && typeof e.text != "undefined" ? j(a, e) : D(a)
	};
	else {
		N.fail("No means of obtaining a Range or TextRange from the user's selection was found");
		return false
	}
	k.refresh = function(a) {
		var e = a ? this._ranges.slice(0) : null;
		$(this);
		if (a) {
			a = e.length;
			if (a != this._ranges.length) return false;
			for (; a--;)
				if (!i.rangesEqual(e[a], this._ranges[a])) return false;
			return true
		}
	};
	var ia = function(a, e) {
		var l = a.getAllRanges(),
			C = false;
		a.removeAllRanges();
		for (var H = 0, P = l.length; H < P; ++H)
			if (C || e !== l[H]) a.addRange(l[H]);
			else C = true;
		a.rangeCount ||
			D(a)
	};
	k.removeRange = K ? function(a) {
		if (this.docSelection.type == "Control") {
			var e = this.docSelection.createRange();
			a = Q(a);
			var l = d.getDocument(e.item(0));
			l = d.getBody(l).createControlRange();
			for (var C, H = false, P = 0, Y = e.length; P < Y; ++P) {
				C = e.item(P);
				if (C !== a || H) l.add(e.item(P));
				else H = true
			}
			l.select();
			o(this)
		} else ia(this, a)
	} : function(a) {
		ia(this, a)
	};
	var aa;
	if (X && m.features.implementsDomRange) {
		aa = function(a) {
			var e = false;
			if (a.anchorNode) e = d.comparePoints(a.anchorNode, a.anchorOffset, a.focusNode, a.focusOffset) == 1;
			return e
		};
		k.isBackwards = function() {
			return aa(this)
		}
	} else aa = k.isBackwards = function() {
		return false
	};
	k.toString = function() {
		for (var a = [], e = 0, l = this.rangeCount; e < l; ++e) a[e] = "" + this._ranges[e];
		return a.join("")
	};
	k.collapse = function(a, e) {
		s(this, a);
		var l = m.createRange(d.getDocument(a));
		l.collapseToPoint(a, e);
		this.removeAllRanges();
		this.addRange(l);
		this.isCollapsed = true
	};
	k.collapseToStart = function() {
		if (this.rangeCount) {
			var a = this._ranges[0];
			this.collapse(a.startContainer, a.startOffset)
		} else throw new n("INVALID_STATE_ERR");
	};
	k.collapseToEnd = function() {
		if (this.rangeCount) {
			var a = this._ranges[this.rangeCount - 1];
			this.collapse(a.endContainer, a.endOffset)
		} else throw new n("INVALID_STATE_ERR");
	};
	k.selectAllChildren = function(a) {
		s(this, a);
		var e = m.createRange(d.getDocument(a));
		e.selectNodeContents(a);
		this.removeAllRanges();
		this.addRange(e)
	};
	k.deleteFromDocument = function() {
		if (K && T && this.docSelection.type == "Control") {
			for (var a = this.docSelection.createRange(), e; a.length;) {
				e = a.item(0);
				a.remove(e);
				e.parentNode.removeChild(e)
			}
			this.refresh()
		} else if (this.rangeCount) {
			a =
				this.getAllRanges();
			this.removeAllRanges();
			e = 0;
			for (var l = a.length; e < l; ++e) a[e].deleteContents();
			this.addRange(a[l - 1])
		}
	};
	k.getAllRanges = function() {
		return this._ranges.slice(0)
	};
	k.setSingleRange = function(a) {
		this.setRanges([a])
	};
	k.containsNode = function(a, e) {
		for (var l = 0, C = this._ranges.length; l < C; ++l)
			if (this._ranges[l].containsNode(a, e)) return true;
		return false
	};
	k.getName = function() {
		return "WrappedSelection"
	};
	k.inspect = function() {
		return q(this)
	};
	k.detach = function() {
		if (this.anchorNode) d.getWindow(this.anchorNode)._rangySelection =
			null
	};
	w.inspect = q;
	m.Selection = w;
	m.addCreateMissingNativeApiListener(function(a) {
		if (typeof a.getSelection == "undefined") a.getSelection = function() {
			return m.getSelection(this)
		};
		a = null
	})
});
