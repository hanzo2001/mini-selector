define(["require", "exports", '../DOMStorage/DOMStorage'], function (require, exports, DOMStorage_1) {
    "use strict";
    (function (global) {
        var trim = String.prototype.trim;
        var slice = Array.prototype.slice;
        var isArr = Array.isArray;
        var proto = Object.getPrototypeOf;
        var nul = function () { return Object.create(null); };
        var isObj = function (o) { return o && typeof o === 'object'; };
        var fEach = Array.prototype.forEach;
        var count = function (o) { return Object.keys(o).length; };
        function oEach(fn) {
            var o = arguments.length > 1 ? arguments[0] : this;
            for (var i in o) {
                fn(o[i], i);
            }
            return o;
        }
        function iterateChildElements(o, fn) {
            var i = 0, cs = o.childNodes, s = cs.length;
            while (i < s) {
                var c = cs[i++];
                if (c.nodeType === Node.ELEMENT_NODE) {
                    fn(c);
                }
                else {
                    i++;
                    continue;
                }
            }
            return o;
        }
        function traverseAllQuickly(m, fn) {
            var q = [];
            var n;
            var i = -1;
            var d = 0;
            while (m) {
                if (m === q[i]) {
                    q.pop();
                    n = m.previousSibling;
                    fn(m, d);
                    if (!d) {
                        break;
                    }
                    m = n;
                    if (!m) {
                        m = q[--i], d--;
                    }
                }
                else {
                    q[++i] = m;
                    if (m.lastChild) {
                        m = m.lastChild, d++;
                    }
                }
            }
        }
        var lib = (function () {
            function extend() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var a, b, c;
                var s, i, j = 0;
                var clone = typeof args[0] === 'boolean' ? args.shift() : false;
                a = args.shift();
                if (!a) {
                    return this;
                }
                s = args.length;
                if (s === 0) {
                    s = args.push(a), a = this;
                }
                if (clone) {
                    while (j < s) {
                        b = args[j++];
                        for (i in b) {
                            c = b[i];
                            if (isArr(c)) {
                                c = extend([], c);
                            }
                            else if (isObj(c)) {
                                c = c.clone ? c.clone() : extend(proto(c) ? {} : nul(), c);
                            }
                            a[i] = c;
                        }
                    }
                }
                else {
                    while (j < s) {
                        b = args[j++];
                        for (i in b) {
                            a[i] = b[i];
                        }
                    }
                }
                return a;
            }
            var Factory = (function () {
                function Factory(a, selector) {
                    extend(this, a);
                    Object.defineProperty(this, 'length', { value: a.length });
                    Object.defineProperty(this, 'selector', { value: selector });
                }
                return Factory;
            }());
            var selector = function (select) {
                var nodeList;
                var selector = null;
                if (select instanceof Node) {
                    nodeList = [select];
                }
                else if (Array.isArray(select)) {
                    nodeList = select;
                }
                else {
                    nodeList = slice.call(document.querySelectorAll(select));
                    selector = select;
                }
                return new Factory(nodeList, selector);
            };
            Factory.prototype = nul();
            selector.extend = extend;
            extend(selector, {
                each: oEach,
                isObject: isObj,
                isResult: function (o) { return o instanceof Factory; },
            });
            extend(Factory.prototype, { extend: extend });
            selector.fn = Factory.prototype;
            selector.fn.extend({
                each: oEach,
            });
            return selector;
        }());
        (function (lib) {
            lib.fn.extend({
                setStyle: function (p, v) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        this[i++].style.setProperty(p, v);
                    }
                    return this;
                },
                setStyleString: function (str) {
                    var ts = str.split(';').map(trim).map(function (v) { return v.split(':'); });
                    var i = 0, j, s = this.length, t = ts.length;
                    while (i < s) {
                        j = 0;
                        while (j < t) {
                            this[i].style.setProperty(ts[j][0], ts[j][1]), j++;
                        }
                        i++;
                    }
                    return this;
                },
                setStyles: function (o) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        for (var j in o) {
                            this[i].style.setProperty(j, o[j]);
                        }
                        i++;
                    }
                    return this;
                },
                toggleVisibility: function () {
                    var i = 0, s = this.length, hidden;
                    while (i < s) {
                        hidden = this[i].style.getProperty('visibility') === 'hidden';
                        this[i++].style.setProperty('visibility', hidden ? 'visible' : 'hidden');
                    }
                    return this;
                },
                setDisplayStyle: function (display) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        this[i++].style.setProperty('display', display);
                    }
                    return this;
                },
                setBounds: function (bounds) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        for (var j in bounds) {
                            this[i].style.setProperty(j, bounds[j]);
                        }
                        i++;
                    }
                    return this;
                },
                setAbsolute: function () {
                    return this.setStyles({ position: 'absolute', margin: '0', padding: '0' });
                }
            });
        }(lib));
        (function (lib) {
            var dataId = 'eventHashId';
            var ListenerData = (function () {
                function ListenerData(e, type, useCapture, data) {
                    var _this = this;
                    this.e = e;
                    this.useCapture = useCapture;
                    this.data = data;
                    this.listener = null;
                    this.fn = [];
                    Object.defineProperties(this, {
                        'type': { value: type },
                        'length': { get: function () { return this.fn.length; } }
                    });
                    this.listener = function (e) {
                        e.data = _this.data;
                        var i = 0, s = _this.fn.length, go = true;
                        while (go && i < s) {
                            go = _this.fn[i++].call(_this.e, e) !== false;
                        }
                    };
                    this.listen();
                }
                ListenerData.prototype.node = function () {
                    return this.e;
                };
                ListenerData.prototype.listen = function () {
                    this.e && this.e.addEventListener(this.type, this.listener, this.useCapture);
                };
                ListenerData.prototype.ignore = function () {
                    this.e && this.e.removeEventListener(this.type, this.listener, this.useCapture);
                };
                ListenerData.prototype.clear = function () {
                    this.ignore();
                    this.e = null;
                    this.listener = null;
                    this.fn = [];
                };
                ListenerData.prototype.push = function (fn) {
                    this.splice(fn);
                    return this.fn.push(fn);
                };
                ListenerData.prototype.splice = function (fn) {
                    var index = this.fn.indexOf(fn);
                    if (index < 0) {
                        return false;
                    }
                    this.fn.splice(index, 1);
                    return this.fn.length;
                };
                return ListenerData;
            }());
            var ListenerFactory = (function () {
                function ListenerFactory() {
                    this.hash = new DOMStorage_1.DOMStorage(dataId);
                }
                ListenerFactory.prototype.on = function (e, type, fn, data, useCapture) {
                    if (useCapture === void 0) { useCapture = false; }
                    var events = this.hash.collect(e);
                    if (!events) {
                        events = nul();
                        this.hash.push(e, events);
                    }
                    var o = events[type];
                    if (!events[type]) {
                        o = new ListenerData(e, type, false, data);
                        events[type] = o;
                    }
                    o.push(fn);
                    return e;
                };
                ListenerFactory.prototype.off = function (e, type, fn, useCapture) {
                    if (useCapture === void 0) { useCapture = false; }
                    var events = this.hash.collect(e);
                    if (!events) {
                        return e;
                    }
                    if (type === undefined) {
                        for (type in events) {
                            events[type].clear();
                        }
                        this.hash.remove(e);
                    }
                    else if (!fn) {
                        var o = events[type];
                        o.clear();
                        if (!count(events)) {
                            this.hash.remove(e);
                        }
                    }
                    else {
                        var o = events[type];
                        if (!o.splice(fn)) {
                            o.clear();
                            if (!count(events)) {
                                this.hash.remove(e);
                            }
                        }
                    }
                    return e;
                };
                ListenerFactory.prototype.clearAll = function () {
                    this.hash.each(function (events) {
                        oEach(events, function (event) { event.clear(); });
                    });
                    this.hash.clear();
                };
                return ListenerFactory;
            }());
            lib.extend({ _eventFactory: new ListenerFactory() });
            lib.fn.extend({
                on: function (type, fn, data) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        lib._eventFactory.on(this[i++], type, fn, data);
                    }
                    return this;
                },
                off: function (type, fn) {
                    var i = 0, s = this.length;
                    while (i < s) {
                        lib._eventFactory.off(this[i++], type, fn);
                    }
                    return this;
                },
                clearAllEvents: function () {
                    lib._eventFactory.clearAll();
                    return this;
                }
            });
        }(lib));
        (function (lib) {
            function removeNodeHook(o) {
                if (o.dataset) {
                    lib._eventFactory.off(o);
                }
                o.parentNode && o.parentNode.removeChild(o);
            }
            lib.fn.extend({
                children: children,
                append: append,
                remove: remove,
                empty: empty,
                text: text
            });
            function children() {
                var i = 0, s = this.length;
                var cs = [];
                while (i < s) {
                    var e = this[i++];
                    cs = cs.concat(slice.call(e.childNodes));
                }
                return lib(cs);
            }
            function append() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var i = 0, s = arguments.length, a = [], e = this[0];
                if (e)
                    while (i < s) {
                        var c = arguments[i++];
                        if (isArr(c)) {
                            c.forEach(function (v) { return a.push(e.appendChild(v)); });
                        }
                        else {
                            a.push(e.appendChild(c));
                        }
                    }
                return lib(a);
            }
            function remove() {
                var i = 0, s = this.length;
                while (i < s) {
                    var e = this[i++];
                    traverseAllQuickly(e, removeNodeHook);
                }
                return this;
            }
            function empty() {
                var i = 0, s = this.length;
                while (i < s) {
                    var e = this[i++];
                    if (e.nodeType !== Node.ELEMENT_NODE) {
                        e.parentNode.removeChild(e);
                        i++;
                        continue;
                    }
                    slice.call(e.childNodes).forEach(function (o) { return traverseAllQuickly(o, removeNodeHook); });
                }
                return this;
            }
            function text(txt) {
                var i = 0, s = this.length;
                while (i < s) {
                    var e = this[i++];
                    slice.call(e.childNodes).forEach(function (o) { return traverseAllQuickly(o, removeNodeHook); });
                    e.appendChild(document.createTextNode(txt));
                }
                return this;
            }
        }(lib));
        global.S = lib;
    }(window));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = S;
});
