'use strict';

// ## CircleSwipe class
// Handle every swipe done on the middle circle
(function(exports){

// ## Constructor
function CircleSwipe(matchContainer, soustractor)
{
	PIXI.DisplayObjectContainer.call(this);

	this.dirs = {};

	this.position.x =  ~~(CS.display.width/2 - matchContainer.whiteCircle.width/2);
	this.position.y = ~~(CS.display.height/2 - matchContainer.whiteCircle.height/2);

	this.distanceMax = null;
	this.durationMax = null;

	this.center = {
		x: ~~(matchContainer.whiteCircle.width/2),
		y: ~~(matchContainer.whiteCircle.height/2)
	};

	// Create the trail used when the user swipe
	this.trail = new PIXI.Sprite(PIXI.Texture.fromFrame( "resources/CircleTrail.png" ));
	this.trail.position.x = this.center.x;
	this.trail.position.y = this.center.y - ~~(this.trail.height/2);
	this.trail.width = 0;
	this.trail.alpha = 0;

	this.addChild(this.trail);


	// Create the center container
	this.centerContainer   = new PIXI.DisplayObjectContainer();

	this.oriPosCenter = {};
	this.oriPosCenter.x = this.centerContainer.position.x =  this.center.x;
	this.oriPosCenter.y = this.centerContainer.position.y = this.center.y;

	this.addChild(this.centerContainer);

	// Create the top Container
	this.topContainer    = new PIXI.DisplayObjectContainer();

	this.oriTopPos = {};
	this.oriTopPos.x = this.topContainer.position.x = this.center.x;
	this.oriTopPos.y = this.topContainer.position.y = this.soustractSide(soustractor);

	this.addChild(this.topContainer);


	// Create the right Container
	this.rightContainer  = new PIXI.DisplayObjectContainer();

	this.oriRightPos = {};
	this.oriRightPos.x = this.rightContainer.position.x = matchContainer.whiteCircle.width - this.soustractSide(soustractor);
	this.oriRightPos.y = this.rightContainer.position.y = this.center.y;

	this.addChild(this.rightContainer);

	// Create the bottom container
	this.bottomContainer = new PIXI.DisplayObjectContainer();

	this.oriBottomPos = {};
	this.oriBottomPos.x = this.bottomContainer.position.x = this.center.x;
	this.oriBottomPos.y = this.bottomContainer.position.y = matchContainer.whiteCircle.height - this.soustractSide(soustractor);

	this.addChild(this.bottomContainer);

	// Create the left container
	this.leftContainer   = new PIXI.DisplayObjectContainer();

	this.oriLeftPos = {};
	this.oriLeftPos.x = this.leftContainer.position.x = this.soustractSide(soustractor)
	this.oriLeftPos.y = this.leftContainer.position.y = this.center.y;

	this.addChild(this.leftContainer);

	this.swipe = new Util.Swipe(matchContainer.whiteCircle);
}

CircleSwipe.constructor = CircleSwipe;
CircleSwipe.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

CircleSwipe.TOP = 'top';
CircleSwipe.CENTER = 'center';
CircleSwipe.RIGHT = 'right';
CircleSwipe.BOTTOM = 'bottom';
CircleSwipe.LEFT = 'left';
CircleSwipe.DIRS = [
	CircleSwipe.TOP,
	CircleSwipe.CENTER,
	CircleSwipe.RIGHT,
	CircleSwipe.BOTTOM,
	CircleSwipe.LEFT
];
CircleSwipe.SELECTABLE_DIRS = [
	CircleSwipe.TOP,
	CircleSwipe.RIGHT,
	CircleSwipe.BOTTOM,
	CircleSwipe.LEFT
];

// ## AddCenter
// Add one graph at the center
CircleSwipe.prototype.addCenter = function(graph)
{
	this.addDirection(CircleSwipe.CENTER, graph);
}


// ## AddTop
// Add one graph at the top
CircleSwipe.prototype.addTop = function(graph, onSelect, soustractor)
{
	this.addDirection(CircleSwipe.TOP, graph, onSelect);
}

// ## AddRight
// Add one graph at the right with a callback which will be fire
// when the user swipe to the right
CircleSwipe.prototype.addRight = function(graph, onSelect, soustractor)
{
	this.addDirection(CircleSwipe.RIGHT, graph, onSelect);
}

// ## AddBottom
// Add one graph at the bottom with a callback which will be fire
// when the user swipe to the bottom
CircleSwipe.prototype.addBottom = function(graph, onSelect, soustractor)
{
	this.addDirection(CircleSwipe.BOTTOM, graph, onSelect);
}

// ## AddLeft
// Add one graph at the left with a callback which will be fire
// when the user swipe to the left
CircleSwipe.prototype.addLeft = function(graph, onSelect, soustractor)
{
	this.addDirection(CircleSwipe.LEFT, graph, onSelect);
}

// ## SoustractSide
// Add a padding
CircleSwipe.prototype.soustractSide = function(soustractor)
{
	var l = 60;
	if(soustractor)
	{
		l += soustractor;
	}

	return l;
}

// ## AddDirection
// Add a direction
CircleSwipe.prototype.addDirection = function(type, graph, onSelect)
{
	if(!this.dirs[type]) this.dirs[type] = [];

	this.dirs[type].push({
		select: onSelect,
		graph: graph
	});

	this.getContainer(type).addChildAt(graph, 0);

	if(this.onAddEntity) this.onAddEntity(type, graph);
}


// ## ShiftDir
// Destroy a direction
CircleSwipe.prototype.shiftDir = function(dir)
{
	if(!this.dirs[dir]
		|| !this.dirs[dir].length) {
		return;
	}
	var container = this.getContainer(dir);

	var dirTab = this.dirs[dir];
	container.removeChild(dirTab[0].graph);
	this.dirs[dir].shift();
}


// ## translate
// Move the fromDir graph to the toDir directino
CircleSwipe.prototype.translate = function(fromDir, toDir, extraParam)
{
	if(!this.dirs[fromDir]
		|| !this.dirs[fromDir].length
		|| !this.dirs[toDir]
		|| !this.dirs[toDir].length
	) {
		return;
	}

	this.swipe.desactive();

	var self = this;

	if(self.activeHighlight)
	{
		var displayHighlight = self[toDir + 'Highlight'];

		var tlPart = new TimelineMax();
		tlPart.to(displayHighlight, 0.15, {alpha:1});
		tlPart.to(displayHighlight, 0.4, {alpha:0});
	}


	var fromDirTab = this.dirs[fromDir];
	var toDirTab = this.dirs[toDir];
	var fromGraph = fromDirTab[0].graph;
	var to = toDirTab[0];
	var toGraph = to.graph;

	var updateTween = this.getDist(fromDir, toDir);

	if(extraParam && extraParam.moveDestBy)
	{
		if(updateTween.x) updateTween.x += -extraParam.moveDestBy * Util.Math2.compare(updateTween.x, 0);
		if(updateTween.y) updateTween.y += -extraParam.moveDestBy * Util.Math2.compare(updateTween.y, 0);
	}

	var duration = (extraParam && extraParam.duration) ? extraParam.duration : 0.5;
	if(this.durationMax && this.distanceMax)
	{
		var rawDist = (updateTween.x) ? Math.abs(updateTween.x) : Math.abs(updateTween.y);
		duration = this.durationMax * (rawDist/this.distanceMax);

	}

	updateTween.onComplete = function(){

		if(extraParam)
		{
			if(extraParam.shiftOrigin)
			{
				self.shiftDir(fromDir);
			}
			else if(extraParam.shiftAll)
			{
				CircleSwipe.DIRS.forEach(function(dName){
					self.shiftDir(dName);
				});
			}

		}

		if(to.select) to.select();

	}


    TweenLite.to(fromGraph.position, duration,  updateTween);

    if(fromDir != CircleSwipe.CENTER) return;

    var updateTrail = {};
    if(updateTween.x) updateTrail.x = updateTween.x;
    if(updateTween.y) updateTrail.y = updateTween.y;


    var graph = this.dirs[fromDir][0].graph;
	var color = graph.color;

	if(this.tlTrail){
		this.tlTrail.clear();
		this.tlTrail = null;
	}

	this.trail.tint = parseInt("0x"+color, 16);
	this.trail.width = 0;
	this.trail.alpha = 0.7;

	var addWidth = 67;

    switch(toDir){
    	case CircleSwipe.TOP:
    		this.trail.rotation = Util.Math2.degToRad(90);
			this.trail.position.x = this.center.x + addWidth;
			this.trail.position.y = this.center.y;
			updateTrail.y += this.trail.position.y;
    		break;
		case CircleSwipe.RIGHT:
			this.trail.rotation = Util.Math2.degToRad(180);
			this.trail.position.x = this.center.x;
			this.trail.position.y = this.center.y + addWidth;

			updateTrail.x += this.trail.position.x;

    		break;
		case CircleSwipe.BOTTOM:
			this.trail.rotation = Util.Math2.degToRad(-90);
			this.trail.position.x = this.center.x - addWidth;
			this.trail.position.y = this.center.y;
			updateTrail.y += this.trail.position.y;
    		break;
		case CircleSwipe.LEFT:
			// Rotation ok
			this.trail.rotation = 0;
			this.trail.position.x = this.center.x;
			this.trail.position.y = this.center.y - ~~(this.trail.height/2);
			updateTrail.x += this.trail.position.x;

    		break;


    }

    updateTrail.width = 315;

    this.tlTrail = new TimelineMax();
    this.tlTrail.to(this.trail, duration, updateTrail);
    this.tlTrail.to(this.trail, (duration/3), {alpha:0}, '-='+(duration/3));



}


// ## GetDist
// return the distance between 2 given direction
CircleSwipe.prototype.getDist = function(fromDir, toDir)
{
	var fromContainer = this.getContainer(fromDir);
	var toContainer = this.getContainer(toDir);

	return {
		x: toContainer.position.x - fromContainer.position.x,
		y: toContainer.position.y - fromContainer.position.y
	};

}


CircleSwipe.prototype.getSwipe = function(){ return this.swipe; }
CircleSwipe.prototype.getLeft = function() { return this.dirs[CircleSwipe.LEFT]; }
CircleSwipe.prototype.getTop = function() { return this.dirs[CircleSwipe.TOP]; }
CircleSwipe.prototype.getRight = function() { return this.dirs[CircleSwipe.RIGHT]; }
CircleSwipe.prototype.getBottom = function() { return this.dirs[CircleSwipe.BOTTOM]; }
CircleSwipe.prototype.getContainer = function(dir) { return this[dir + 'Container']; }
CircleSwipe.prototype.getOffsetContainer = function(dir) {
	return {
		x: this[dir + 'Container'].position.x + this.position.x,
		y: this[dir + 'Container'].position.y + this.position.y
	};
}
CircleSwipe.prototype.getBlueLight = function() { return this.blueLight; }
CircleSwipe.prototype.getRedLight = function() { return this.redLight; }

CircleSwipe.prototype.setDistanceMax = function(distance) { this.distanceMax = distance; }
CircleSwipe.prototype.setDurationMax = function(duration) { this.durationMax = duration; }

exports.CircleSwipe = CircleSwipe;

})(window.UI = window.UI || {})
