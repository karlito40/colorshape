'use strict';

// ## Symbol class
// Just a symbol to display
(function(exports){

// ## Constructor
function Symbol(symbol)
{
	var texture = PIXI.Texture.fromFrame(symbol);
	PIXI.Sprite.call(this, texture);

	this.position.x = ~~(-this.width/2);
	this.position.y = ~~(-this.height/2);

	if(symbol == 'play')
	{
		this.position.x += 10;
	}

	this.symbol = symbol;
}

Symbol.constructor = Symbol;
Symbol.prototype = Object.create(PIXI.Sprite.prototype);

// ## GetSymbol
Symbol.prototype.getSymbol = function(){ return this.symbol;}

exports.Symbol = Symbol;

})(window.Graph = window.Graph || {})
