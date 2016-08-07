define(["require", "exports"], function (require, exports) {
    "use strict";
    var DOMStorage = (function () {
        function DOMStorage(dataId) {
            this.s = dataId;
            this.i = 0;
            this.h = Object.create(null);
        }
        DOMStorage.prototype.push = function (e, d) {
            var i = ++this.i;
            this.h[i] = d;
            e.dataset[this.s] = i.toString(16);
        };
        DOMStorage.prototype.collect = function (e) {
            var i = e.dataset[this.s];
            return this.h[i] || null;
        };
        DOMStorage.prototype.remove = function (e) {
            var i = e.dataset[this.s];
            var d = this.h[i] || null;
            delete this.h[i];
            e.dataset[this.s] = '';
            return d;
        };
        DOMStorage.prototype.clear = function () {
            for (var i in this.h) {
                this.h[i] = null;
            }
            this.h = Object.create(null);
            this.i = 0;
        };
        DOMStorage.prototype.each = function (fn, tArg) {
            if (tArg === void 0) { tArg = null; }
            for (var i in this.h) {
                fn.call(tArg, this.h[i], i);
            }
        };
        return DOMStorage;
    }());
    exports.DOMStorage = DOMStorage;
});
