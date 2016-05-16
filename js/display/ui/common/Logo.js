'use strict';

// ## Logo class
// Create the logo application.
(function(exports){
function Logo(gameScene)
{
	PIXI.DisplayObjectContainer.call(this);
	var ignoredColors = [];
	if(gameScene.matchContainer && gameScene.matchContainer.match){
		ignoredColors.push(gameScene.matchContainer.match.goToColor.toString(16));
	}

	var c = this.findColor(ignoredColors);
	ignoredColors.push(c);
	this.color2 = '0x' + c;
	if(gameScene.mode == Scene.GameScene.COLOR_MODE || (gameScene.mode == Scene.GameScene.SHAPE_MODE && !gameScene.matchContainer.isGrey())) {
		c = this.findColor(ignoredColors);
		ignoredColors.push(c);

		this.color1 = '0x' + c;
		var texture = PIXI.Texture.fromFrame("Logo-tocolor-nocircle");

	} else {
		c = this.findColor(ignoredColors);
		ignoredColors.push(c);

		this.color1 = '0x' + c;
		var texture = PIXI.Texture.fromFrame("Logo-tosymbol-nocircle");

	}

	this.logo = new PIXI.Sprite(texture);
	this.addChild(this.logo);

	this.firstOChar = new PIXI.BitmapText('O', { font: "95px CocoPuff-Regular", tint: parseInt(this.color1, 16), align: "center" });


	this.firstOChar.position.y -= 25;
	this.firstOChar.position.x = 80;
	this.addChild(this.firstOChar);

	this.secondOChar = new PIXI.BitmapText('O', { font: "95px CocoPuff-Regular", tint: parseInt(this.color2, 16), align: "center" });


	this.secondOChar.position.y -= 25;
	this.secondOChar.position.x = 230;

	this.addChild(this.secondOChar);
}

Logo.constructor = Logo;
Logo.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Logo.prototype.findColor = function(notEqualsTo){
	if(!notEqualsTo){
		var notEqualsTo = [];
	}

	do{
		var rI = Util.Math2.randomInt(0, CS.colorsRef.length-1);
		var color = CS.colorsRef[rI];
	}while(notEqualsTo.indexOf(color) != -1);

	return color;

}

exports.Logo = Logo;

})(window.UI = window.UI || {})
