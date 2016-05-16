'use strict';

// ## MatchContainer class
// Basically this is the big circle in the middle of the screen
(function(exports){

// ## Constructor
function MatchContainer(scene)
{
	PIXI.DisplayObjectContainer.call(this);

	this.scene = scene;

	var texture = PIXI.Texture.fromImage("resources/bg-white-circle.png");
	this.whiteCircle = new PIXI.Sprite(texture);

	this.whiteCircle.anchor.x = this.whiteCircle.anchor.y = 0.5;
	this.whiteCircle.position.x = ~~(CS.display.width/2);
	this.whiteCircle.position.y = ~~(CS.display.height/2);

	this.scaleOri = 1;
	this.whiteCircle.scale.y = this.whiteCircle.scale.x = this.scaleOri;

	if(this.scene.mode == Scene.GameScene.SHAPE_MODE) this.toGrey();
	else this.toDefault();


	this.addChild(this.whiteCircle);
	this.oldMatch = null;

	this.interactive = true;


}

MatchContainer.constructor = MatchContainer;
MatchContainer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

// ## ToGrey
// the circle should be grey when the last circle was white (only in symbol mode)
MatchContainer.prototype.toGrey = function()
{
	this.realTint = this.whiteCircle.tint = 0xBABABA;
}

// ## ToDefault
// The circle is white by default
MatchContainer.prototype.toDefault = function()
{
	this.realTint = this.whiteCircle.tint = 0xFFFFFF;
}

// ## IsGrey
MatchContainer.prototype.isGrey = function()
{
	return this.realTint == 0xBABABA;
}


// ## BounceCircle
// Well.. it bounce the circle
MatchContainer.prototype.bounceCircle = function()
{
	var self = this;

	this.addMatch();

	this.whiteCircle.scale.x = this.whiteCircle.scale.y = this.scaleOri;

	var goToScale = this.scaleOri/2.5;
	var firstScale = this.scaleOri-0.05;

	var tl = new TimelineMax();

	tl.to(this.whiteCircle.scale, 0.1, {
		x:firstScale, y:firstScale,
		ease: Power2.easeOut
	});
	tl.to(this.whiteCircle, 0, {alpha:0, onStart: function(){
		self.match.go();
	}});

	tl.to(this.whiteCircle.scale, 0, {
		x:goToScale, y:goToScale
	});
	tl.to(this.whiteCircle, 0, {alpha:1, onStart: function(){
		if(self.isGrey()) self.toDefault();
		else if(self.scene.mode == Scene.GameScene.SHAPE_MODE) self.toGrey();
	}}, '+=0.01');

	tl.to(this.whiteCircle.scale, 0.2, {
		x:this.scaleOri, y:this.scaleOri,
		ease: new Ease(BezierEasing(0.33, 0.33, 0.47, 1.37))
	}, 'start');

	tl.timeScale(0.75);

}

// ## AddMatch
MatchContainer.prototype.addMatch = function(){

	var lastColor = (this.oldMatch) ? this.oldMatch.lastColor : null;

	this.match = new UI.Match(lastColor, this.whiteCircle.width, this);

	if(this.oldMatch){
		TweenMax.to([this.oldMatch.titleText, this.oldMatch.tipsText], 0.2, {alpha:0});
	}

	var self = this;
	this.match.onStartComplete = function(old){
		return function(){
			if(old) {
				try{
					self.removeChild(old);
				} catch(e){
					console.log('unable to remove old match');
				}
			}
		}

	}(this.oldMatch);

	this.addChildAt(this.match, this.children.length - 1);
	this.oldMatch = this.match;

}

exports.MatchContainer = MatchContainer;

})(window.UI = window.UI || {})
