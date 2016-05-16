'use strict';

(function(exports){

function Swipe(display, dirsCallback)
{
	this.display = display;
	this.dirsCallback = dirsCallback || {};

	this.active = true;
	this._release();
}

Swipe.TOP = 't';
Swipe.RIGHT = 'r';
Swipe.LEFT = 'l';
Swipe.BOTTOM = 'b';

Swipe.prototype.desactive = function()
{
	this.active = false;
}

Swipe.prototype.reactive = function()
{
	this.active = true;
}

Swipe.prototype.setTopCallback = function(cb)
{
	this.setCallback(Swipe.TOP, cb);
}

Swipe.prototype.setRightCallback = function(cb)
{
	this.setCallback(Swipe.RIGHT, cb);
}

Swipe.prototype.setBottomCallback = function(cb)
{
	this.setCallback(Swipe.BOTTOM, cb);
}

Swipe.prototype.setLeftCallback = function(cb)
{
	this.setCallback(Swipe.LEFT, cb);
}

Swipe.prototype.setCallback = function(dir, cb)
{
	this.dirsCallback[dir] = cb;
}


Swipe.prototype._release = function()
{
	var self = this;

	var isMouseDown = false;
	var isComplete = false;
	var start = {x: 0, y:0}
	this.display.interactive = true;
	this.display.touchstart = this.display.mousedown = function(interactionData) {
		if(!self.active) return;
		start = interactionData.getLocalPosition(self.display);
		isMouseDown = true;

	};

	this.display.mousemove = this.display.touchmove = function(interactionData) {

		if(!self.active || !isMouseDown) return;


		var end = interactionData.getLocalPosition(self.display);

		var distance = self.getDistance(start, end);
		if(distance.xDist < 50 && distance.yDist < 50) return;

		isMouseDown = false;

		self.handleCallback(distance);

	}

}

Swipe.prototype.handleCallback = function(distance)
{
	var dir = null;
	if(distance.yDist > distance.xDist) dir = (distance.signedY < 0) ? Swipe.TOP : Swipe.BOTTOM;
	else dir = (distance.signedX < 0) ? Swipe.LEFT : Swipe.RIGHT;


	if(this.dirsCallback[dir])
	{
		this.dirsCallback[dir]();
	}
}


Swipe.prototype.getDistance = function(start, end)
{

	var signedX = end.x - start.x;
	var signedY = end.y - start.y;
	var xDist = Math.abs(signedX);
	var yDist = Math.abs(signedY);

	return {
		signedX: signedX,
		signedY: signedY,
		xDist: xDist,
		yDist: yDist
	};
}





Swipe.prototype.destroy = function()
{

}


exports.Swipe = Swipe;


})(window.Util = window.Util || {})