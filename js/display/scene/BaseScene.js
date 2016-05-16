'use strict';

// ## BaseScene class

(function(exports){

// # Constructor
function BaseScene(className)
{
	PIXI.DisplayObjectContainer.call(this);

	this.id = BaseScene.i++;
	this.className = className;
	this.open = false;
	this.position.x = 0;
	this.position.y = 0;
	this.visible = false;
	this.alpha = 0;
}

BaseScene.constructor = BaseScene;
BaseScene.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

BaseScene.current = null;
BaseScene.i = 0;

// ## Start
BaseScene.prototype.start = function()
{

	if(this.open)
	{
		return;
	}

	if(BaseScene.current)
	{
		BaseScene.current.close();
	}

	BaseScene.current = this;

	this.open = true;

	this.create();

	CS.stage.addChild(this);

	this.visible = true;
	TweenLite.to(this, CS.config.scene.fadeIn, {alpha:1, onComplete: this.onReady});

	this.logic();
}


// ## Close
// This is handle automatically when a new scene is start
BaseScene.prototype.close = function()
{
	if(!this.open)
	{
		return;
	}

	BaseScene.current = null;
	this.open = false;

	TweenMax.to(this, CS.config.scene.fadeOut, {alpha:0, onComplete: this._clean.bind(this)});

}

// ## Restart
BaseScene.prototype.restart = function()
{
	this.reset = true;
	this.close();
}

BaseScene.prototype._clean = function()
{
	CS.stage.removeChild(this);
	if(this.reset)
	{
		var restartScene = new window[this.className]();
		restartScene.start();
	}

	this.onClearHandler();
}


BaseScene.prototype.onClearHandler = function()
{

}

// ## Logic
// This is supposed to be an abstract method.
// Add the scene logic here.
BaseScene.prototype.logic = function()
{

}


BaseScene.prototype._stopAnims = function(namespace, reset)
{
	if(namespace)
	{
		this._stopAnimsHandler(namespace, reset);
	}
	else
	{
		for(var namespace in this.anims)
		{
			this._stopAnimsHandler(namespace, reset);
		}
	}

}

BaseScene.prototype._stopAnimsHandler = function(namespace, reset)
{
	if(!this.anims[namespace])
	{
		return;
	}

	for(var i in this.anims[namespace])
	{
		if(reset)
		{
			this.anims[namespace][i].pause(0);
		}
		this.anims[namespace][i].kill();
	}
	delete this.anims[namespace];
}

BaseScene.prototype.hasAnim = function(namespace)
{
	return this.anims[namespace];
}

BaseScene.prototype._addAnim = function(tl, namespace)
{
	if(!namespace)
	{
		var namespace = 'default';
	}
	if(!this.anims[namespace])
	{
		this.anims[namespace] = [];
	}
	this.anims[namespace].push(tl);
}


exports.BaseScene = BaseScene;

})(window.Scene = window.Scene || {})
