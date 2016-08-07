/// <reference path="./index.d.ts" />

import S from './MiniSelector/MiniSelector';

(function(){
	let ce = (tag, txt:string='') => {
		let r = document.createElement(tag);
		r.innerHTML = txt;
		return r;
	};
	let fn = function(e:MiniSelectorEvent){
		S(this).append(ce('span',', '+e.data.str));
	};
	let data = {str:'hellomore'};
	S('#run').setStyles({
		background: 'red',
		color: 'white'
	});
	let active = false;
	S(document.body)
		.append(ce('button'))
			.on('click',function(){
				if (active) {
					S('#run').off();
					S(this).text('enable');
				} else {
					S('#run').on('click',fn,data);
					S(this).text('disable');
				}
				active = !active;
			})[0].click();
}());
