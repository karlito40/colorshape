'use strict';

// ## Math2 static class
// Math2 add some usefull math function which does not
// exist in Math

(function(exports) {

var Math2 = {};

// ## Random
// return a float between from and to (included)
Math2.random = function(from, to) {
	return Math.random()*(to-from) + from;
}

// # RandomInt
// return an int between from and to (included)
Math2.randomInt = function(from, to) {
	to += 1;
	return Math.floor(Math.random()*(to-from) + from);
}

// ## RandomBool
// return a boolean
Math2.randomBool = function(chance) {
	chance = chance ? chance : 0.5;
	return (Math.random() < chance) ? true : false;
}

// ## DegToRad
// return a radian with the given degree
Math2.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
}

// ## Compare
// compare 2 numbers
Math2.compare = function(i1, i2) {
	if(i1 == i2) return 0;
	return (i1 > i2) ? 1 : -1;
}

exports.Math2 = Math2;

})(window.Util = window.Util || {})
