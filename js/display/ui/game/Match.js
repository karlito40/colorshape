'use strict';

// Match class
// Match handle the animation of one game level

(function(exports){

// ## Constructor
function Match(lastColor, baseWidth, matchContainer)
{
	PIXI.DisplayObjectContainer.call(this);

	Match.nbMatch++;
	this.baseWidth = baseWidth;
	this.lastColor = lastColor ||null;
	this.name = Match.nbMatch;

	var baseColor = null;
	var goToColor = null;
	if(matchContainer.scene.mode == Scene.GameScene.SHAPE_MODE)
	{
		if(matchContainer.isGrey()){
			goToColor = baseColor = 0xBABABA;
		} else  {
			goToColor = baseColor = 0xFFFFFF;
		}
	}

	this.goToColor = (goToColor) ? goToColor : null;
	this.currentColor = (baseColor) ? baseColor : 0xFFFFFF;

	this.bgCircle = new PIXI.Graphics();
	this.updateBgCircle();
	this.addChild(this.bgCircle);

	this.initDestColor();

	var color = (matchContainer.scene.mode == Scene.GameScene.SHAPE_MODE && !matchContainer.isGrey()) ? 0xbababa : 0xffffff;

	this.titleText = new PIXI.BitmapText(matchContainer.scene.score.toString(), { font: "140px VeraBd", tint: color, align: "center" });
	this.titleText.position.x = ~~(CS.display.width/2) - ~~(this.titleText.width/2);
	this.titleText.position.y = 80;

	this.addChild(this.titleText);

	var tips = (matchContainer.scene.mode == Scene.GameScene.SHAPE_MODE) ? I18N.get('match_symbols').toUpperCase() : I18N.get('match_colors').toUpperCase();

	this.tipsText = new PIXI.BitmapText(tips, { font: "45px VeraBd", tint: color, align: "center" });
	this.tipsText.position.x = ~~(CS.display.width/2 - this.tipsText.width/2);
	this.tipsText.position.y = 230;

	this.addChild(this.tipsText);

	this.alpha = 0;

}

Match.nbMatch = 0;

Match.constructor = Match;
Match.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


// ## RemoveText
Match.prototype.removeText = function()
{
	this.removeChild(this.tipsText);
	this.removeChild(this.titleText);
}


// ## GetTitle
Match.prototype.getTitle = function()
{
	return this.titleText;
}

// ## GetTips
Match.prototype.getTips = function()
{
	return this.tipsText;
}

// ## UpdateBgCircle
Match.prototype.updateBgCircle = function(){
	this.bgCircle.clear();
	this.bgCircle.beginFill(this.currentColor, 1);
	this.bgCircle.drawCircle(CS.display.width/2, CS.display.height/2, ~~(this.baseWidth/2));
	this.bgCircle.endFill();
}


// ## InitDestColor
// Create the final color
Match.prototype.initDestColor = function()
{
	if(this.goToColor) return;

	do
	{
		var goToColor = CS.colorsRef[~~(Math.random()*CS.colorsRef.length)];
		goToColor = "0x" + goToColor;
		goToColor = parseInt(goToColor, 16);
	} while(goToColor === this.lastColor);

	this.goToColor = goToColor;

}

// ## GO
// launch the animation
Match.prototype.go = function(){


	this.lastColor = this.goToColor;
	var colorTween = {color: this.currentColor};

	var duration = 0.15;
	var scaleBy = 1.6;

	if(this.tl){
		this.tl.clear();
		this.tl = null;
	}

	var tl = new TimelineMax();

	var easeWith = Linear.easeNone;
	this.alpha = 1;

	colorTween.width = this.baseWidth;

	var self = this;
	tl.to(colorTween, duration, {colorProps: {color: this.goToColor}, width: CS.display.width * 2.2 , ease: easeWith, onUpdate: function(){
		self.currentColor = parseInt(Util.Color.rgbToHex(colorTween.color), 16);
		self.baseWidth = colorTween.width;

		self.updateBgCircle();

	}}, 'start');

	tl.timeScale(0.75);

	tl.call(this.onStartComplete);


}

exports.Match = Match;

})(window.UI = window.UI || {})
