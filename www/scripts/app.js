define(["require", "exports", './MiniSelector/MiniSelector'], function (require, exports, MiniSelector_1) {
    "use strict";
    (function () {
        var ce = function (tag, txt) {
            if (txt === void 0) { txt = ''; }
            var r = document.createElement(tag);
            r.innerHTML = txt;
            return r;
        };
        var fn = function (e) {
            MiniSelector_1.default(this).append(ce('span', ', ' + e.data.str));
        };
        var data = { str: 'hellomore' };
        MiniSelector_1.default('#run').setStyles({
            background: 'red',
            color: 'white'
        });
        var active = false;
        MiniSelector_1.default(document.body)
            .append(ce('button'))
            .on('click', function () {
            if (active) {
                MiniSelector_1.default('#run').off();
                MiniSelector_1.default(this).text('enable');
            }
            else {
                MiniSelector_1.default('#run').on('click', fn, data);
                MiniSelector_1.default(this).text('disable');
            }
            active = !active;
        })[0].click();
    }());
});
