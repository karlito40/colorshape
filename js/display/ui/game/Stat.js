'use strict';

// ## Stat class
// Display the highscore & the game played at the bottom of our screen

(function(exports){
function Stat(scene)
{
	PIXI.DisplayObjectContainer.call(this);

	var bestScore = CS.PlayerInfo.getHighscore();
	var gamePlayed = CS.PlayerInfo.getGamePlayed();

	var isWhite = false;

	var color1 = 0x808080;
	var color2 = 0xBABABA;
	if(scene.mode == Scene.GameScene.COLOR_MODE || (scene.mode == Scene.GameScene.SHAPE_MODE && !scene.matchContainer.isGrey())) {
		isWhite = true;
		color2 = color1 = 0xFFFFFF;
	}


	this.bestScoreText =  new PIXI.BitmapText(I18N.get('best_score', {':x': bestScore}),
		{ font: "60px VeraBd", tint: color1 }
	);

	this.addChild(this.bestScoreText);

	this.gamePlayedText =  new PIXI.BitmapText(I18N.get('game_played', {':x': gamePlayed}).toUpperCase(),
		{ font: "50px VeraBd", tint: color2 }
	);
	this.gamePlayedText.position.y = 60;
	if(isWhite) {
		this.gamePlayedText.alpha = 0.5;
	}

	this.addChild(this.gamePlayedText);

	this.bestScoreText.position.x = ~~(this.width/2 - this.bestScoreText.width/2);
	this.gamePlayedText.position.x = ~~(this.width/2 - this.gamePlayedText.width/2);

}

Stat.constructor = Stat;
Stat.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

exports.Stat = Stat;

})(window.UI = window.UI || {})
