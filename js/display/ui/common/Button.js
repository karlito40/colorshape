'use strict';

// ## Button class
// Associate a texture to a button. The button will let
// you specified a callback to execute on a hit effect.
// He also handle his own animation.
// <pre>
// 	var b = UI.Button(myTexture);
// 	b.onSubmit = function(){alert('hit'), };
// </pre>

(function(exports){

function Button(texture)
{
	PIXI.Sprite.call(this, texture);

	this.anchor.x = this.anchor.y = 0.5;
	this.oriScale = null;
	this.tween = null;
	var self = this;

	this.interactive = true;
	this.mousedown = this.touchstart = function(){
		self.anim();
		CS.Sound.fxPlay('bouton');

		if(self.onSubmit) self.onSubmit();
	};

}


Button.constructor = Button;
Button.prototype = Object.create(PIXI.Sprite.prototype);

// ## Anim
// Play an animation on every hit
Button.prototype.anim = function()
{

	if(!this.oriScale){
		this.oriScale = {
			x: this.scale.x,
			y: this.scale.y
		}
	}

	this.scale.x += 0.5;
	this.scale.y += 0.5;

	var self = this;
	if(this.tween) {
		this.tween.kill();
	}
	this.tween = TweenMax.to(this.scale, 0.5, {x: this.oriScale.x, y: this.oriScale.y, ease: Elastic.easeOut})
}

exports.Button = Button;

})(window.UI = window.UI || {})
