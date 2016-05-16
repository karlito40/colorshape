'use strict';

// ## GameScene class

(function(exports){

// ## Constructor
function GameScene()
{
	exports.BaseScene.call(this, 'GameScene');

	this.turn = 0;
	this.score = 0;
	this.nbWon = 0;
	this.nbColorMatch = 0;
	this.nbSymbolMatch = 0;
	this.timeLeft = CS.config.levelDesign.timeLimit;
	this.cmdColorPercent = CS.config.levelDesign.colorPercent;

	this.retractedAt = null;
	this.hasStart = false;
	this.playing = true;

	CS.GS = this;
}

GameScene.prototype.constructor = GameScene;
GameScene.prototype = Object.create(exports.BaseScene.prototype);

GameScene.COLOR_MODE = 'color_mode';
GameScene.SHAPE_MODE = 'shape_mode';
GameScene.DIFFICULTY_EASY = 'easy';
GameScene.DIFFICULTY_HARD = 'hard';


// ## ShareHandler
GameScene.prototype.shareHandler = function()
{
	if(this.btnMore.visible == false) return;

	var self = this;
	this.btnMore.visible = false;
	this.F4F.visible = false;
	this.shareBtn.visible = false;

	var backBtn = new UI.Button(PIXI.Texture.fromFrame( this.getFrameCircleUI()  ));
	backBtn.scale.x = backBtn.scale.y = 1.27;

	var symbolBack = new PIXI.Sprite(PIXI.Texture.fromImage( "resources/Back-icon.png" ));

	symbolBack.scale.x = symbolBack.scale.y = 0.8;
	symbolBack.position.x = -50;
	symbolBack.position.y = -40;
	symbolBack.tint = this.getTintUI();

	backBtn.position.x = ~~(CS.display.width/2);
	backBtn.position.y = ~~(CS.display.height/2) - 270;

	backBtn.addChild(symbolBack);


	backBtn.onSubmit = function(){
		self.removeChild(backBtn);
		self.removeChild(self.btnGameCenter);
		self.removeChild(self.btnLeaderboard);
		self.btnMore.visible = true;
		self.F4F.visible = true;
		self.shareBtn.visible = true;
	};

	this.addAchievementsBtn();
	this.addLeaderboardBtn();
	this.addChild(backBtn);

}

GameScene.prototype.addShareBtn = function(doAnim){
	this.shareBtn = new UI.Button(PIXI.Texture.fromFrame( "circle-" + this.logo.color1.slice(2) ));
	this.shareBtn.scale.x = this.shareBtn.scale.y = 1.27;
	this.shareBtn.position.x = ~~(CS.display.width/2)  + 270;
	this.shareBtn.position.y = ~~(CS.display.height/2);

	var shareLayer = new PIXI.Sprite(PIXI.Texture.fromImage( "resources/Share-icon.png" ));
	shareLayer.scale.x = shareLayer.scale.y = 0.8;
	shareLayer.position.y = -40;
	shareLayer.position.x = -50;

	this.shareBtn.addChild(shareLayer);

	var self = this;
	this.shareBtn.onSubmit = function(){
		Cocoon.Social.share(I18N.get('share_text', {
			':x': self.score
		}));
	}

	this.addChild(this.shareBtn);
	if(doAnim) this.animUI(this.shareBtn);

}

// ## AddMoreBtn
// Add the "more" button display at the end of the game.
// It will trigger the F4F and share buttons display.
GameScene.prototype.addMoreBtn = function(doAnim)
{
	this.btnMore = new UI.Button(PIXI.Texture.fromFrame( this.getFrameCircleUI() ));
	this.btnMore.scale.x = this.btnMore.scale.y = 1.27;
	this.btnMore.onSubmit = this.shareHandler.bind(this);

	var symbolMore = new PIXI.Sprite(PIXI.Texture.fromFrame( "More-icon" ));

	symbolMore.scale.x = symbolMore.scale.y = 0.8;
	symbolMore.position.x = ~~(-symbolMore.width/2) /*+ 20*/;
	symbolMore.position.y = ~~(-symbolMore.height/2)/* + 20*/;
	symbolMore.tint = this.getTintUI();

	this.btnMore.addChild(symbolMore);

	this.btnMore.position.x = ~~(CS.display.width/2);
	this.btnMore.position.y = ~~(CS.display.height/2) - 270;

	this.addChild(this.btnMore);

	if(doAnim) this.animUI(this.btnMore);

}

// ## AddFinalScore
// Add the final score at the end of the game
GameScene.prototype.addFinalScore = function(doAnim)
{
	var group = new PIXI.DisplayObjectContainer();

	var colorText = (this.matchContainer.isGrey()) ? 0xffffff : 0xbababa;
	this.scoreText = new PIXI.BitmapText(this.score.toString(), { font: "100px VeraBd", tint: colorText, align: "center" });

	group.addChild(this.scoreText);

	var s = (this.score > 1 ) ? "POINTS" : "POINT";

	this.pointsText = new PIXI.BitmapText(s, { font: "50px VeraBd", tint: colorText, align: "center" });
	this.pointsText.position.y = 100;


	group.addChild(this.pointsText);

	this.pointsText.position.x = ~~(group.width/2 - this.pointsText.width/2);
	this.scoreText.position.x = ~~(group.width/2 - this.scoreText.width/2);

	group.position.x = ~~(CS.display.width/2 - group.width/2);
	group.position.y = ~~(CS.display.height/2) - 70;

	this.addChild(group);

	if(doAnim) this.animUI(group);

}

// ## AddRestartBtn
// Add the "restart" at the end of the game. It just restart the scene.
GameScene.prototype.addRestartBtn = function(doAnim)
{
	this.btnRestart = new UI.Button(PIXI.Texture.fromFrame( this.getFrameCircleUI() ));
	this.btnRestart.onSubmit = this.onRestartSubmit;

	this.btnRestart.scale.x = this.btnRestart.scale.y = 1.27;

	var symbolRestart = new PIXI.Sprite(PIXI.Texture.fromFrame( "Replay-icon" ));

	symbolRestart.scale.x = symbolRestart.scale.y = 0.7;
	symbolRestart.position.x = ~~(-symbolRestart.width/2) /*+ 20*/;
	symbolRestart.position.y = ~~(-symbolRestart.height/2)/* + 20*/;
	symbolRestart.tint = this.getTintUI();

	this.btnRestart.addChild(symbolRestart);

	this.btnRestart.position.x = ~~(CS.display.width/2);
	this.btnRestart.position.y = ~~(CS.display.height/2) + 270;

	this.addChild(this.btnRestart);

	if(doAnim) this.animUI(this.btnRestart);
}

// ## AddAchievementsBtn
// Add the "achievements" at the end of the game.
GameScene.prototype.addAchievementsBtn = function(doAnim)
{
	this.btnGameCenter = new UI.Button(PIXI.Texture.fromFrame( "circle-" + this.logo.color2.slice(2) ));
	this.btnGameCenter.onSubmit = this.showAchievements.bind(this);

	this.btnGameCenter.scale.x = this.btnGameCenter.scale.y = 1.27;

	var symbolCup = new PIXI.Sprite(PIXI.Texture.fromFrame( "Cup-icon" ));

	symbolCup.scale.x = symbolCup.scale.y = 0.8;
	symbolCup.position.x = ~~(-symbolCup.width/2)-3;
	symbolCup.position.y = ~~(-symbolCup.height/2);

	this.btnGameCenter.addChild(symbolCup);

	this.btnGameCenter.position.x = ~~(CS.display.width/2)  - 270;
	this.btnGameCenter.position.y = ~~(CS.display.height/2);

	this.addChild(this.btnGameCenter);

	if(doAnim) this.animUI(this.btnGameCenter);
}


// ## ShowAchievements
// Show the achievements game center thing
GameScene.prototype.showAchievements = function()
{
	console.log('showAchievements');
	Mobile.GameCenter.request(function executeCmd(){
		if(!Mobile.GameCenter.getSocialService()) return;

		Mobile.GameCenter.getSocialService().showAchievements();

	});
}


GameScene.prototype.addF4FBtn = function(doAnim){
	this.F4F = new UI.Button(PIXI.Texture.fromImage("resources/F4F-icon.png"));
	this.F4F.position.x = ~~(CS.display.width/2)  - 270;
	this.F4F.position.y = ~~(CS.display.height/2);

	this.F4F.onSubmit = function(){
		Cocoon.App.openURL(CS.config.F4FUrl);
	};

	this.addChild(this.F4F);

	if(doAnim) this.animUI(this.F4F);

}

// ## AddLeaderboardBtn
// Add the "leaderboard" button at the end of the game
GameScene.prototype.addLeaderboardBtn = function(doAnim)
{
	this.btnLeaderboard = new UI.Button(PIXI.Texture.fromFrame( "circle-" + this.logo.color1.slice(2) ));
	this.btnLeaderboard.scale.x = this.btnLeaderboard.scale.y = 1.27;
	this.btnLeaderboard.onSubmit = function() {
		Mobile.GameCenter.showLeaderboard();
	};

	var symbolLaber = new PIXI.Sprite(PIXI.Texture.fromFrame( "Ladder-icon" ));

	symbolLaber.scale.x = symbolLaber.scale.y = 0.8;
	symbolLaber.position.x = ~~(-symbolLaber.width/2);
	symbolLaber.position.y = ~~(-symbolLaber.height/2)-5;

	this.btnLeaderboard.addChild(symbolLaber);

	this.btnLeaderboard.position.x = ~~(CS.display.width/2)  + 270;
	this.btnLeaderboard.position.y = ~~(CS.display.height/2);

	this.addChild(this.btnLeaderboard);

	if(doAnim) this.animUI(this.btnLeaderboard);
}

// ## GetFrameCircleUI
GameScene.prototype.getFrameCircleUI = function()
{
	var x = (this.matchContainer.isGrey()) ? "ffffff" : "bababa";
	return "circle-" + x;
}

// ## GetTintUI
GameScene.prototype.getTintUI = function()
{
	return ( this.matchContainer.isGrey() ) ?  0xBABABA : 0xFFFFFF;
}

// ## Create
GameScene.prototype.create = function()
{
	var self = this;
	this.mode = GameScene.SHAPE_MODE;

	this.matchContainer = new UI.MatchContainer(this);
	this.addChild(this.matchContainer);

	this.addMenu();
	this.addLogo();
	this.addStats();

	this.arrow =  new PIXI.Sprite(PIXI.Texture.fromFrame("resources/SmallArrowTrail.png"));
	this.arrow.width = 0;
	this.arrow.position.x = ~~(CS.display.width/2);
	this.arrow.position.y = ~~(CS.display.height/2 - this.arrow.height/2);
	this.addChild(this.arrow);

	this.circleSwipe = new UI.CircleSwipe(this.matchContainer, 0);
	this.circleSwipe.setDistanceMax(303);
	this.circleSwipe.setDurationMax(0.35);

	this.circleSwipe.onAddEntity = this.addEntityHandler;

	var swipe = this.circleSwipe.getSwipe();
	swipe.desactive();

	swipe.setBottomCallback(function(){
		self.controlSwipe(UI.CircleSwipe.CENTER, UI.CircleSwipe.BOTTOM);
	});

	swipe.setLeftCallback(function(){
		self.controlSwipe(UI.CircleSwipe.CENTER, UI.CircleSwipe.LEFT);
	});

	swipe.setRightCallback(function(){
		self.controlSwipe(UI.CircleSwipe.CENTER, UI.CircleSwipe.RIGHT);
	});

	swipe.setTopCallback(function(){
		self.controlSwipe(UI.CircleSwipe.CENTER, UI.CircleSwipe.TOP);
	});

	this.addChild(this.circleSwipe);

	this.tipText = new PIXI.BitmapText(I18N.get('slide_to_play').toUpperCase(), { font: "50px VeraBd", fill: "white" });
	this.tipText.position.x = this.circleSwipe.position.x - ~~(this.tipText.width/2) + this.circleSwipe.center.x;
	this.tipText.position.y = this.circleSwipe.position.y + 180;
	this.tipText.alpha = 0.3;

	this.addChild(this.tipText);

	this.pxPerSec = this.circleSwipe.distanceMax/CS.config.levelDesign.timeLimit; // Pixel parcouru par seconde

	this.intro();


}

// ## Intro
GameScene.prototype.intro = function()
{
	this.launch();

}

// ## Launch
// Launch the game
GameScene.prototype.launch = function()
{
	CS.launch++;

	this.circleSwipe.getSwipe().reactive();

	this.levels = [];

	for(var i=0; i<2; i++)
	{
		var mode = this.randMode();
		var ignorePieces = {};

		if(i==1) ignorePieces[this.levels[0].meta.discover.toString()] = true;

		this.levels.push({
			meta: CS.pool.generateStep(mode, ignorePieces, this.randDifficulty()),
			mode: mode
		});
	}

	this.displayRound();

	this.circleSwipe.addCenter(this.currentRound.meta.discover);
	this.levels[1].meta.discover.scale.x = this.levels[1].meta.discover.scale.y = 0;
	this.circleSwipe.addCenter(this.levels[1].meta.discover);

	var compatibleDir = this.getCompatibleDir();
	var targetOffset = this.circleSwipe.getOffsetContainer(compatibleDir);

	var arrowDuration = 1;
	var widthMax = 155;
	this.tlIntro = new TimelineMax({repeat: -1});

	var centerContainer = this.circleSwipe.getContainer(UI.CircleSwipe.CENTER);

	this.tlIntro.to(centerContainer.scale, 0.1, {x: 0.8, y:0.8, ease:Linear.easeNone}, 'start');
	this.tlIntro.to(centerContainer.scale, 0.1, {x: 1.2, y:1.2, ease:Linear.easeNone}, 'start+=0.1');
	this.tlIntro.to(centerContainer.scale, 0.1, {x: 0.9, y:0.9, ease:Linear.easeNone}, 'start+=0.2');
	this.tlIntro.to(centerContainer.scale, 0.1, {x: 1, y:1}, 'start+=0.3');


	this.tlIntro.to(this.tipText, 0.2, {alpha: 1}, 'start');
	this.tlIntro.to(this.tipText, 0.5, {alpha: 0.3}, 'start+=0.3');

	switch(compatibleDir)
	{
		case UI.CircleSwipe.TOP:
			this.arrow.position.x += ~~(this.arrow.height/2);
			this.arrow.rotation = Util.Math2.degToRad(90);

			this.tlIntro.to(this.arrow, arrowDuration, {width: widthMax}, 'start');
			this.tlIntro.to(this.arrow.position, arrowDuration, {y: targetOffset.y}, 'start');

			break;
		case UI.CircleSwipe.RIGHT:
			this.arrow.position.y += this.arrow.height;
			this.arrow.rotation = Util.Math2.degToRad(180);

			this.tlIntro.to(this.arrow, arrowDuration, {width: widthMax}, 'start');
			this.tlIntro.to(this.arrow.position, arrowDuration, {x: targetOffset.x}, 'start');

			break;
		case UI.CircleSwipe.BOTTOM:
			this.arrow.position.x -= ~~(this.arrow.height/2);
			this.arrow.rotation = Util.Math2.degToRad(270);

			this.tlIntro.to(this.arrow, arrowDuration, {width: widthMax}, 'start');
			this.tlIntro.to(this.arrow.position, arrowDuration, {y: targetOffset.y}, 'start');
			break;
		case UI.CircleSwipe.LEFT:
			this.tlIntro.to(this.arrow, arrowDuration, {width: widthMax}, 'start');
			this.tlIntro.to(this.arrow.position, arrowDuration, {x: targetOffset.x}, 'start');
			break;
	}

	this.tlIntro.to(this.arrow, 0.3, {alpha: 0});



}


// ## IncrScore
GameScene.prototype.incrScore = function(by)
{
	this.score += by;
}


// ## ErrorAnim
// Fire the error anim on any error
GameScene.prototype.errorAnim = function()
{
	var graphics = new PIXI.Graphics();

	graphics.beginFill(0xff120c);
	graphics.drawRect(0, -this.position.y, CS.display.width+this.position.y, CS.display.height);

	graphics.alpha = 0;

	this.addChild(graphics);

	var self = this;
	var tl = new TimelineMax();
	tl.to(graphics, 0.25, {alpha: 0.75});
	tl.to(graphics, 0.90, {alpha: 0});

}



// ## Retract
// Retract each graphs to the center point
GameScene.prototype.retract = function(useTimeline)
{

	this.retractAnim = (useTimeline) ? useTimeline : new TimelineMax();

	var self = this;
	var i = 0;


	UI.CircleSwipe.SELECTABLE_DIRS.forEach(function(dir){

		var container = self.circleSwipe.getContainer(dir);
		var tweenObject = self.circleSwipe.getDist(dir, UI.CircleSwipe.CENTER);

		if(tweenObject.x === 0) delete tweenObject.x;
		if(tweenObject.y === 0) delete tweenObject.y;

		if(tweenObject.x) tweenObject.x += container.position.x;
		if(tweenObject.y) tweenObject.y += container.position.y;

		tweenObject.ease = Linear.easeNone;

		self.retractAnim.to( container, self.timeLeft,  tweenObject, 'start');
	});

	this.retractAnim.call(function(){
		self.gameOver(true);
	});

}

// ## GameOver
// End game.
GameScene.prototype.gameOver = function(byTime)
{
	if(!this.playing) return;

	var self = this;
	this.playing = false;
	this.circleSwipe.getSwipe().desactive();


	var myHighscore = CS.PlayerInfo.getHighscore();
	if(this.score > myHighscore) {
		CS.PlayerInfo.setHighscore(this.score);
	}

	Mobile.GameCenter.submitScore(this.score);

	CS.lastScore = this.score;


	var tl = new TimelineMax();

	UI.CircleSwipe.DIRS.forEach(function(dir){
		if(!self.circleSwipe.dirs[dir] || !self.circleSwipe.dirs[dir].length) {
			return;
		}

		var container = self.circleSwipe.getContainer(dir);
		tl.to(container, 0.2, {alpha:0}, 'start');
	});

	TweenLite.to([this.matchContainer.match.tipsText, this.matchContainer.match.titleText], 0.2, {alpha: 0});



	tl.call(function(){
		CS.config.ads.interstitial.current++;
		if(CS.config.ads.interstitial.eachGame == CS.config.ads.interstitial.current) {
			if(CS.config.ads.interstitial.ready && (CS.config.ads.test || CS.config.ads.show)) {
				Cocoon.Ad.showInterstitial();
			}
			CS.config.ads.interstitial.current = 0;
		}

		self.addFinalScore(true);

		self.addLogo(true);
		self.addMenu(true);
		self.addStats(true);

		self.addRestartBtn(true);
		// self.addAchievementsBtn(true);
		self.addF4FBtn(true);
		// self.addLeaderboardBtn(true);
		self.addShareBtn(true);
		self.addMoreBtn(true);


		CS.PlayerInfo.unlockAchievement('points', self.score);

		CS.PlayerInfo.incrColorMatch(self.nbColorMatch);
		CS.PlayerInfo.incrSymbolMatch(self.nbSymbolMatch);

		CS.PlayerInfo.unlockAchievement('colors', CS.PlayerInfo.getColorMatch());
		CS.PlayerInfo.unlockAchievement('symbols', CS.PlayerInfo.getSymbolMatch());



	});


}

// ## DisplayRound
// Display the current round
GameScene.prototype.displayRound = function()
{

	var self = this;
	this.currentRound = this.levels[0];

	this.circleSwipe.addTop(this.currentRound.meta.pieces[0], function(){
		self.selectPiece(0, UI.CircleSwipe.TOP);
	});
	this.circleSwipe.addRight(this.currentRound.meta.pieces[1], function(){
		self.selectPiece(1, UI.CircleSwipe.RIGHT);
	});
	this.circleSwipe.addBottom(this.currentRound.meta.pieces[2], function(){
		self.selectPiece(2, UI.CircleSwipe.BOTTOM);
	});
	this.circleSwipe.addLeft(this.currentRound.meta.pieces[3], function(){
		self.selectPiece(3, UI.CircleSwipe.LEFT);
	});

	this.mode = this.currentRound.mode;

}

// ## GetCompatibleDir
// get the match solution.
GameScene.prototype.getCompatibleDir = function()
{
	if(this.isPieceCompatible(this.currentRound.meta.pieces[0]))
		return UI.CircleSwipe.TOP;
	else if(this.isPieceCompatible(this.currentRound.meta.pieces[1]))
		return UI.CircleSwipe.RIGHT;
	else if(this.isPieceCompatible(this.currentRound.meta.pieces[2]))
		return UI.CircleSwipe.BOTTOM;
	else if(this.isPieceCompatible(this.currentRound.meta.pieces[3]))
		return UI.CircleSwipe.LEFT;


}

// ## IsPieceCompatible
// Check if the graphs match
GameScene.prototype.isPieceCompatible = function(piece)
{
	return (
		(this.currentRound.mode == GameScene.COLOR_MODE && this.currentRound.meta.discover.getColor() == piece.getColor())
		|| (this.currentRound.mode == GameScene.SHAPE_MODE && this.currentRound.meta.discover.getSymbol() == piece.getSymbol())
	)
}

// ## SelectPiece
// Select a graph and check if we won or lost
GameScene.prototype.selectPiece = function(pieceId, dir)
{
	var piece = this.currentRound.meta.pieces[pieceId];

	var choice = this.currentRound.meta.pieces[pieceId];
	var useLastMode = true;
	if(this.winTurn)
	{
		this.wonRound();
		useLastMode = false;
	}
	else
	{
		this.loseRound(piece);
		return;
	}

	this.generateRound(useLastMode);
}

// ## WonRound
// We won our round yeaa !
GameScene.prototype.wonRound = function()
{
	var self = this;

	this.turn++;
	this.incrScore(1);

	if(this.mode == GameScene.COLOR_MODE) {
		this.nbColorMatch++;
	} else {
		this.nbSymbolMatch++;
	}

	// CS.Sound.fxPlay('bon_matching');
	CS.Sound.fxPlay('bouton');
	this.addTime();
}

// ## LoseRounded
// We lost ..
GameScene.prototype.loseRound = function(selectPiece)
{
	this.stopAnims();

	this.errorAnim();

	CS.Sound.fxPlay('mauvais_matching');

	var compatibleDir = this.getCompatibleDir()
	var centerContainer = this.circleSwipe.getContainer(UI.CircleSwipe.CENTER);
	var compatibleContainer = this.circleSwipe.getContainer(compatibleDir);

	var self = this;
	UI.CircleSwipe.SELECTABLE_DIRS.forEach(function(dir){
		var container = self.circleSwipe.getContainer(dir);

		if(dir == compatibleDir) return;

		self.circleSwipe.shiftDir(dir);

	});

	var tl = new TimelineMax();

	tl.to([compatibleContainer.scale, centerContainer.scale], 0.65, {x:1.3, y:1.3}, 'start');
	tl.to([compatibleContainer, centerContainer], 0.3, {alpha: 0}, 'start+=0.5');


	tl.to(this.matchContainer.match.titleText.position, 0.3, {y: -150-this.position.y}, 'start');

	var scaleBy = 1.5;
	var toDest = {
		x: this.matchContainer.match.tipsText.position.x,
		y: 150
	};


	toDest.ease = Elastic.easeOut;
	tl.to(this.matchContainer.match.tipsText.position, 1, toDest, 'start');

	tl.call(function(){
		self.gameOver();
	});

}


// ## AddTime
// Add some time to our game. It's fire each time we won a round.
GameScene.prototype.addTime = function(cb)
{
	var self = this;

	this.stopAnims();

	var tl = new TimelineMax();

	var addDistance = ~~(this.circleSwipe.distanceMax/2);


	UI.CircleSwipe.SELECTABLE_DIRS.forEach(function(dir){

		var container = self.circleSwipe.getContainer(dir);

		if(dir == UI.CircleSwipe.TOP) {
			container.position.y = Math.max(container.position.y - addDistance, self.circleSwipe.oriTopPos.y);
		} else if(dir == UI.CircleSwipe.RIGHT) {
			container.position.x = Math.min(container.position.x + addDistance, self.circleSwipe.oriRightPos.x);
		} else if(dir == UI.CircleSwipe.BOTTOM) {
			container.position.y = Math.min(container.position.y + addDistance, self.circleSwipe.oriBottomPos.y);
		} else if(dir == UI.CircleSwipe.LEFT) {
			container.position.x = Math.max(container.position.x - addDistance, self.circleSwipe.oriLeftPos.x);
		}

	});


	var leftContainer = this.circleSwipe.getContainer(UI.CircleSwipe.LEFT);
	var currentDistance = this.circleSwipe.distanceMax/* - (leftContainer.position.x - this.circleSwipe.oriLeftPos.x)*/;

	this.timeLeft = Math.max(2, CS.config.levelDesign.timeLimit - (this.nbWon * 0.1));

	this.nbWon++;

	this.retract();

}

GameScene.prototype.stopAnims = function()
{
	if(this.retractAnim)
	{
		this.retractAnim.clear();
		this.retractAnim = null;
	}

	if(this.addTimeAnim)
	{
		this.addTimeAnim.clear();
		this.addTimeAnim = null;
	}

}

// ## RandMode
// generate another mode
GameScene.prototype.randMode = function()
{

	var genMode = null;
	if(this.turn < CS.config.levelDesign.colorAt)
	{
		genMode = GameScene.SHAPE_MODE;
	}
	else if(Util.Math2.randomInt(0, 100) < this.cmdColorPercent)
	{
		genMode = GameScene.COLOR_MODE;
		this.cmdColorPercent -= CS.config.levelDesign.colorPercentDecrBy;
	}
	else
	{
		genMode = GameScene.SHAPE_MODE;
		this.cmdColorPercent = CS.config.levelDesign.colorPercent;
	}

	return genMode;
}

// ## RandDifficulty
// Generate a difficulty
GameScene.prototype.randDifficulty = function()
{
	var step = ~~(this.turn/10);
	var percent = 100 - (step*10);
	var genDifficulty = null;
	if(percent > 0 && Util.Math2.randomInt(0, 100) <= percent)
	{
		genDifficulty = GameScene.DIFFICULTY_EASY;
	}
	else
	{
		genDifficulty = GameScene.DIFFICULTY_HARD;
	}

	return genDifficulty;
}

// ## ControlSwipe
// Translate the center graph to the selected direction. The first
// swipe execute the StartGame action
GameScene.prototype.controlSwipe = function(fromDir, toDir)
{
	if(!this.playing) return;

	if(!this.turn) {
		var compatibleDir = this.getCompatibleDir();
		if(toDir != compatibleDir) return;

	}

	if(!this.hasStart) this.startGame();


	var piece = this.circleSwipe.dirs[toDir][0].graph;
	this.winTurn = this.isPieceCompatible(piece);

	var extraParam = {};
	if(this.winTurn) {
		extraParam.shiftAll = true;
	}

	extraParam.moveDestBy = 50;
	this.circleSwipe.translate(fromDir, toDir, extraParam);
}

// ## StartGame
// Hide some UI when the game start
GameScene.prototype.startGame = function()
{

	this.hasStart = true;

	CS.PlayerInfo.incrGamePlayed();
	CS.PlayerInfo.unlockAchievement('games', CS.PlayerInfo.getGamePlayed());

	var self = this;

	if(this.tlIntro){
		this.tlIntro.clear();
		this.tlIntro = null;
	}
	this.removeChild(this.arrow);

	var centerContainer = this.circleSwipe.getContainer(UI.CircleSwipe.CENTER);
	TweenLite.to(centerContainer.scale, 0.15, {x: 1, y:1, ease: Power4.easeOut}, 'start');

	TweenLite.to(this.tipText, 0.2, {alpha:0, onComplete: function(){
		self.removeChild(self.tipText);
	}});

	var tl = new TimelineMax();
	tl.to(this.logo, 0.15, {alpha:0}, 'start');
	tl.to(this.statHolder, 0.2, {alpha: 0}, 'start');
	tl.to(this.menu, 0.15, {alpha: 0}, 'start');

	tl.call(function(){
		self.removeChild(self.logo);
		self.removeChild(self.statHolder);
		self.removeChild(self.menu);
	});

	this.retract();
}

// ## GenerateRound
// Generate a new level
GameScene.prototype.generateRound = function(useLastMode)
{
	this.circleSwipe.getSwipe().reactive();

	var lastMode = this.levels[0].mode;
	var mode = (!useLastMode) ? this.randMode() : lastMode;


	this.levels.shift();

	var newMode = this.levels[0].mode;

	var ignorePieces = {};
	ignorePieces[this.levels[0].meta.discover.toString()] = true;

	this.levels[0].meta.discover.alpha = 1;

	TweenLite.to(this.levels[0].meta.discover.scale, 0.2, {x: 1, y: 1, ease: Back.easeOut});

	this.levels.push({
		meta: CS.pool.generateStep(mode, ignorePieces, this.randDifficulty()),
		mode: mode
	});

	this.displayRound();
	this.matchContainer.bounceCircle();

	this.levels[1].meta.discover.scale.x = this.levels[1].meta.discover.scale.y = 0;
	this.circleSwipe.addCenter(this.levels[1].meta.discover);

}

// ## AddEntityHandler
GameScene.prototype.addEntityHandler = function(dir, graph)
{
	if(dir == UI.CircleSwipe.CENTER) return;

	graph.scale.x = 0;
	graph.scale.y = 0;
	graph.alpha = 0;

	var tl = new TimelineMax();
	tl.to(graph, 0.2, {alpha:1}, 'start');
	tl.to(graph.scale, 0.5, {x:1, y:1, ease: Back.easeOut}, 'start');
}

// ## AddLogo
GameScene.prototype.addLogo = function(doAnim)
{
	// Logo de l'appli
	this.logo = new UI.Logo(this);
	this.logo.position.x = ~~(CS.display.width/2 - this.logo.width/2);
	this.logo.position.y = 75;

	this.addChild(this.logo);

	if(doAnim) this.animUI(this.logo);
}

// ## RefreshAdsBtn
GameScene.prototype.refreshAdsBtn = function()
{
	if(!this.menu) return;

	this.menu.refreshAdsBtn();
}

// ## AddMenu
GameScene.prototype.addMenu = function(doAnim)
{
	this.menu = new UI.Menu(this);
	this.menu.position.y = 300;

	this.addChild(this.menu);
	if(doAnim) this.animUI(this.menu);

}

// ## AnimUI
GameScene.prototype.animUI = function(displayObject){
	displayObject.alpha = 0;
	TweenLite.to(displayObject, CS.config.gameScene.animUIDuration, {alpha:1});
}

// ## AddStats
GameScene.prototype.addStats = function(doAnim)
{
	this.statHolder = new UI.Stat(this);
	this.statHolder.position.x = ~~(CS.display.width/2 - this.statHolder.width/2);
	this.statHolder.position.y = CS.display.height - 280;

	this.addChild(this.statHolder);

	if(doAnim) this.animUI(this.statHolder);
}

exports.GameScene = GameScene;

})(window.Scene = window.Scene || Scene);
