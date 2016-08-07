/// <reference path="../typings/index.d.ts" />

require.config({
	baseUrl : './scripts',
	paths : {
		app : 'app'
	}
});
require(['app']);
