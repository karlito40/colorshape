'use strict';

// ## Menu class
// Handle the no-ads item and the sound option

(function(exports){
function Menu(scene)
{
	PIXI.DisplayObjectContainer.call(this);

	this.widthRef = CS.config.app.width-30;
	this.scene = scene;

	this.btnAds = new UI.Button(PIXI.Texture.fromFrame("noads-icon"));
	this.btnAds.position.x = ~~(this.btnAds.width/2);
	this.btnAds.onSubmit = this.noAdsHandler.bind(this);
	this.btnAds.alpha = (CS.config.ads.show) ? 1 : 0;
	// this.btnAds.alpha = 0;
	this.btnAds.visible = CS.config.ads.show;

	this.addChild(this.btnAds);


	var frame = "circle-" + scene.matchContainer.realTint.toString(16);
	this.btnSound = new UI.Button(PIXI.Texture.fromFrame( frame ));
	this.btnSound.position.x = this.widthRef - ~~(this.btnSound.width/2);
	this.btnSound.onSubmit = this.soundHandler.bind(this);

	this.symbolSound = new PIXI.Sprite(PIXI.Texture.fromFrame(this.getSoundSymbol()));
	this.symbolSound.position.x =   ~~(-this.symbolSound.width/2);
	this.symbolSound.position.y =   ~~(-this.symbolSound.height/2);


	if( scene.mode == Scene.GameScene.COLOR_MODE || (scene.mode == Scene.GameScene.SHAPE_MODE && !scene.matchContainer.isGrey()) ){
		this.symbolSound.tint = 0xbababa;
	}
	this.btnSound.addChild(this.symbolSound);

	this.addChild(this.btnSound);

	this.position.x = ~~(CS.display.width/2) - this.widthRef/2;

}

Menu.constructor = Menu;
Menu.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


// ## RefreshAdsBtn
// Hide or display the ads btn depending the user purchased
Menu.prototype.refreshAdsBtn = function()
{
	var self = this;

	// var oldAlpha = this.realAlpha;

	if(CS.config.ads.show) {
		this.realAlpha = this.btnAds.aplha = 1;
	} else {
		this.realAlpha = this.btnAds.alpha = 0;
	}

	this.btnAds.visible = CS.config.ads.show;

	// if(this.ensureAlpha && oldAlpha != this.realAlpha) {
	// 	clearTimeout(this.ensureAlpha);
	// 	this.ensureAlpha = null;
	// }
	//
	// // Bug pixi
	// this.ensureAlpha = setTimeout(function(){
	// 	self.btnAds.visible = CS.config.ads.show;
	// 	self.btnAds.alpha = self.realAlpha;
	// }, 3000);
}

// ## NoAdsHandler
// Display a popup to restore or purchased the no-ads item
Menu.prototype.noAdsHandler = function()
{

	console.log('NO ADS HANDLER');

	var blackScreen = new PIXI.Graphics();
	blackScreen.beginFill(0x000000);
	blackScreen.drawRect(0, 0, CS.display.width, CS.display.height);
	blackScreen.endFill();
	blackScreen.hitArea = new PIXI.Rectangle(0, 0, CS.display.width, CS.display.height);

	blackScreen.alpha = 0.7;

	var tmpWidth = 600;
	var tmpHeight = 140;
	var x,y;

	var removeBg = new PIXI.Graphics();
	removeBg.beginFill(0xFFFFFF);
	x = Math.floor(CS.display.width/2 - tmpWidth/2);
	y = Math.floor(CS.display.height/2 - tmpHeight/2) - 90;
	removeBg.drawRoundedRect(x, y, tmpWidth, tmpHeight, 40);
	removeBg.endFill();
	removeBg.hitArea = new PIXI.Rectangle(x, y, tmpWidth, tmpHeight);

	var removeText = new PIXI.BitmapText(I18N.get('remove_ads').toUpperCase(), { font: "50px VeraBd", tint: 0xBABABA });
	removeText.position.x = Math.floor(x + (tmpWidth/2) - (removeText.width/2));
	removeText.position.y = y + 50;

	var restoreBg = new PIXI.Graphics();
	restoreBg.beginFill(0xBABABA);
	y = Math.floor(CS.display.height/2) - Math.floor(tmpHeight/2) + 90;
	restoreBg.drawRoundedRect(x, y, tmpWidth, tmpHeight, 40);
	restoreBg.endFill();
	restoreBg.hitArea = new PIXI.Rectangle(x, y, tmpWidth, tmpHeight);

	var restoreText = new PIXI.BitmapText(I18N.get('restore_inapp').toUpperCase(), { font: "50px VeraBd" });
	restoreText.position.x = Math.floor(x + (tmpWidth/2) - (restoreText.width/2));
	restoreText.position.y = y + 50;


	var group = new PIXI.DisplayObjectContainer();
	group.addChild(blackScreen)
	group.addChild(removeBg);
	group.addChild(removeText);
	group.addChild(restoreBg);
	group.addChild(restoreText);

	// group.addChild(restoreInApp);

	var self = this;
	var killGroup = function(){
		TweenMax.to(group, 0.2, {alpha: 0, onComplete: function(){
			self.scene.removeChild(group);
		}})

	}

	// Affect every handler
	removeBg.interactive = true;
	removeBg.mousedown = removeBg.touchstart = function(){
		self.addLoading();
		Mobile.Store.connect(function(){
			self.removeLoading();
			Cocoon.Store.purchase('com.3dduo.coloredshapes.removeads');
			killGroup();
		})
	};

	restoreBg.interactive = true;
	restoreBg.mousedown = restoreBg.touchstart = function(){
		self.addLoading();
		Mobile.Store.connect(function(){
			self.removeLoading();
			Cocoon.Store.restore();
			killGroup();
		});
	};

	blackScreen.interactive = true;
	blackScreen.mousedown = blackScreen.touchstart = killGroup;

	group.alpha = 0;

	this.scene.addChild(group);

	TweenMax.to(group, 0.2, {alpha: 1});

}

Menu.prototype.addLoading = function(){
	if(this.loading) return;

	var blackScreen = new PIXI.Graphics();
	blackScreen.beginFill(0x000000);
	blackScreen.drawRect(0, 0, CS.display.width, CS.display.height);
	blackScreen.endFill();
	blackScreen.alpha = 0.8;


	this.loading = new PIXI.DisplayObjectContainer();

	var text = new PIXI.BitmapText(I18N.get('loading'), {font: "50px VeraBd"});
	text.position.x = Math.floor( CS.display.width/2 - text.width/2 );
	text.position.y = Math.floor( CS.display.height/2 - text.height/2 );

	this.loading.addChild(blackScreen);
	this.loading.addChild(text);

	this.scene.addChild(this.loading);

}

Menu.prototype.removeLoading = function(){
	if(!this.loading) return;

	this.scene.removeChild(this.loading);
	this.loading = null;
}

Menu.prototype.getSoundSymbol = function(){
	return (CS.PlayerInfo.getSound()) ? 'soundON-icon' : 'soundOFF-icon';
}

Menu.prototype.soundHandler = function()
{
	if(CS.PlayerInfo.getSound()){
		CS.Sound.stopAll();
		CS.PlayerInfo.setSound(false);
	} else {
		CS.PlayerInfo.setSound(true);
		CS.Sound.play('bg');
	}

	this.symbolSound.setTexture(PIXI.Texture.fromFrame(this.getSoundSymbol()));



}

exports.Menu = Menu;

})(window.UI = window.UI || {})
