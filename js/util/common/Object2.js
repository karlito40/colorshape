'use strict';

// ## Object2

(function(exports) {

var Object2 = {}

// ## Each
// foreach(value, key) function
Object2.each = function(o, cb){
	for(var key in o) {
		if(cb(o[key], key) === false)  return;
	}
}

exports.Object2 = Object2;

})(window.Util = window.Util || {});
