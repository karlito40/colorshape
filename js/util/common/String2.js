'use strict';

// ## String2
(function(exports) {

var String2 = {}

// ## strtr
// replace each key given in o with the respectively value on the current string.
// <pre>String2.strtr("toto :x", {':x', 'awesome'});
// will return "toto awesome"</pre>
String2.strtr = function(string, o) {
	var s2 = string;

	for(var find in o) {
 		var replaceBy = o[find];
 		var regex = new RegExp(find, "g");

 		s2 = s2.replace(regex, replaceBy);
 	}

 	return s2;
}


exports.String2 = String2;

})(window.Util = window.Util || {});
