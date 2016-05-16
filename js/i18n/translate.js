'use strict';

// ## I18N Static Class

(function(exports){

	var map = {};

	// Available languages
	exports.langs = ['fr', 'en'];
	// Language used by default
	exports.lang = exports.def = exports.langs[0];

	// ## Get
	// Retrieve a translation with the given key. Return the key if we
	// are unable to find something
	exports.get = function(key, o) {
		if(typeof map[key] == "undefined" || !map[key][exports.lang]) {
			return key;
		}

		var s = map[key][exports.lang];

		if(o) {
			s = Util.String2.strtr(s, o);
		}

		return s;
	}

	// ## InitLang
	// Initialize a language with the given lang if possible
	exports.initLang = function(lang) {
		if(!lang || exports.langs.indexOf(lang) == -1) {
			lang = exports.def;
		}

		exports.lang = lang;
	}

	// ## SetAvailableLangs
	// Replace the available languages
	exports.setAvailableLangs = function(langs){
		exports.langs = langs;
	}

	// ## SetDefaultLang
	// The language to use by default
	exports.setDefaultLang = function(lang){
		exports.lang = lang;
	}

	// ## SetTrad
	// Set the translation mapping
	exports.setTrad = function(trad) {
		map = trad;
	}

})(window.I18N = window.I18N || {})
