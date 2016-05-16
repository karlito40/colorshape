'use strict';

// # Main class
// The main class is the entry point of the application
// A *canvas* will be created.
// A *stage* instance will handle each draws on the canvas.
// He will also enable *ads*, *in-app* and *game center*.
(function(exports){

// # Constructor
// First, we create a global stage accessible with CS.stage. It can be usefull if you want to draw directly into the stage.
// Then we let PIXI detect the possible render (webGL or 2d context fallback).
// Next we resize the newly canvas and initialize the mobile stuff.
// Finally, we load images and musics and we wait for the ready function to be called.
function Main()
{
	this.notifQueue = [];

	exports.stage = new PIXI.Stage(0xFFFFFF);
  this.renderer = new PIXI.CanvasRenderer(CS.display.width, CS.display.height);
  // this.renderer = PIXI.autoDetectRenderer(CS.display.width, CS.display.height);

	this.resize();
	if(!navigator.isCocoonJS)
	{
		window.onresize = this.resize.bind(this);
	}

	document.body.appendChild(this.renderer.view);
	this.update();

	this.initPlayer();
	this.initMobile();
	this.loadAssets();

}

// ## Resize
// Adapt the canvas to the screen device
Main.prototype.resize = function()
{

	var width = window.innerWidth || document.body.clientWidth;
	var height = window.innerHeight || document.body.clientHeight;


	this.renderer.view.style.height = height + 'px';	// Adapte le canvas a la hauteur du screen
	this.renderer.view.style.width  = width + 'px';	// Adapte le canvas a la largeur du screen

	var ratio = height / CS.config.app.height;
	var newWidth = (width / ratio);
	this.renderer.resize(newWidth, CS.config.app.height);

	CS.display.width = newWidth;
	CS.display.height = CS.config.app.height;
	CS.scale = ratio;
}

// ## Update
// Redraw the stage every X ms.
Main.prototype.update = function()
{

	this.renderer.render(exports.stage);
	requestAnimFrame(this.update.bind(this));
}

// ## Ready
// Create a pool which will be responsible to generate 5 symbols each level/match.
// Launch the SplashScrene and call the launchGame function when every splash has been shown.
Main.prototype.ready = function()
{
	CS.Sound.play('bg');
	CS.pool = new Graph.PoolGraph();

	var splashScene = new Scene.SplashScene();
	splashScene.onEnd = this.launchGame.bind(this);
	splashScene.start();
}

// ## LaunchGame
// Create a GameScene and start it
Main.prototype.launchGame = function(){
   	this.gameScene = new Scene.GameScene();
   	this.gameScene.onRestartSubmit = this.launchGame.bind(this);
    this.gameScene.start();
}

// ## LoadAssets
// Load every asset defined in CS.manifest (*js/config.js*) and call the ready function when everything is complete.
Main.prototype.loadAssets = function()
{

	console.log('sprite loading');

	var self = this
		, soundLoaded = false
		, assetsLoaded = false;
	var onEverythingLoad = function(){
		if(soundLoaded && assetsLoaded){
			self.ready();
		}
	}

	var loader = new PIXI.AssetLoader(CS.manifest);
	loader.onComplete = function(){
		assetsLoaded = true;
		onEverythingLoad();
	};
	loader.load();


	CS.Sound.prepareLoad([
			{name: 'bg', loop: true},
			{name: 'bon_matching'},
			{name: 'mauvais_matching'},
			{name: 'bouton'}
	]);
	CS.Sound.load(function onload(){}, function oncomplete(){
		soundLoaded = true;
		onEverythingLoad();
	});


}

// ## initPlayer
// There is clearly nothing to do.
// We are just adding a new callback which will show a banner on a new achievement event.
Main.prototype.initPlayer = function()
{
	var self = this;
	CS.PlayerInfo.onNewAchievement = function(achievementID){
		console.log('onnewachievement', achievementID);
		var ref = Mobile.GameCenter.getAchievement(achievementID);
		if(ref === false) return;

		self.addNotification({
			sprite: new PIXI.Sprite(PIXI.Texture.fromImage("resources/achievements/"+achievementID+".jpg")),
			title: ref.title,
			description: ref.description
		});


	}

	if(CS.PlayerInfo.getSound() == null) {
		CS.PlayerInfo.setSound(true)
	}

}

// ## InitMobile
// It's the *tricky part*.
// First we force the user to be connect to the GameCenter.
// Then we look for the product purshased to hide the "no ads" button (if the current scene is the game scene)
// This is also hide automatically the button when you actually purchased the in-app.
// Then we try to loads some ads. CocoonJS handle their placement with your mopub configuration. The setInterval is used to
// accelerate the process as some request may be very slow or even lost. This interval is clear on the first response.
Main.prototype.initMobile = function() {
	Mobile.GameCenter.login(true);

	CS.config.ads.show = !CS.PlayerInfo.hasPurchase(CS.config.ads.removeAdsId);
	// CS.config.ads.show = true;
	this.loadAds();

	var self = this;
	Mobile.Store.products = [CS.config.ads.removeAdsId];
	Mobile.Store.onPurchase = function onPurchaseHandler(productId){
			CS.PlayerInfo.addPurchase(productId);
			if(productId == CS.config.ads.removeAdsId) {
				CS.PlayerInfo.unlockAchievement(CS.config.ads.removeAdsId);
				self.stopAds();
			}
	}
}

Main.prototype.stopAds = function(){
	CS.config.ads.show = false;
	Cocoon.Ad.hideBanner();
	if(typeof CS.GS != "undefined" && CS.GS.open) {
		CS.GS.refreshAdsBtn();
	}

}

Main.prototype.loadAds = function(){

	// We are now trying to handle the ads which can be a banner or an interstitial
	//
	var loadBannerAccel = null;
	var loadInterstitialAccel = null;

	Cocoon.Ad.banner.on("ready" , function(){
		if(CS.config.ads.test || CS.config.ads.show) {
			Cocoon.Ad.setBannerLayout(Cocoon.Ad.BannerLayout.BOTTOM_CENTER);
			Cocoon.Ad.showBanner();
		}

		if(loadBannerAccel) {
			clearInterval(loadBannerAccel);
			loadBannerAccel = null;
		}
	});

	Cocoon.Ad.interstitial.on("ready", function(){
		CS.config.ads.interstitial.ready = true;
		if(loadInterstitialAccel) {
			clearInterval(loadInterstitialAccel);
			loadInterstitialAccel = null;
		}
	});

	if(CS.config.ads.test || CS.config.ads.show) {
		console.log('loadBanner');
		loadBannerAccel = setInterval(function(){
			Cocoon.Ad.loadBanner();
		}, 10000);
		Cocoon.Ad.loadBanner();

		console.log('loadInterstital');
		loadInterstitialAccel = setInterval(function(){
			Cocoon.Ad.loadInterstitial();
		}, 10000);
		Cocoon.Ad.loadInterstitial();
	}
}

// ## AddNotification
// Add a notification to the notifQueue and launch it (if possible).
// A notification is a banner display on the header of the application. Actually, this is just used by the new achievement handler.
Main.prototype.addNotification = function(o) {
	if(typeof exports.stage == "undefined" || !exports.stage || !Scene.BaseScene.current) return;

	var self = this;

	this.notifQueue.push(function(){
		var notif = new PIXI.DisplayObjectContainer();
		var bgIco = new PIXI.Sprite(PIXI.Texture.fromFrame('resources/ach_banner.png'));
		bgIco.scale.x = 1.3;
		bgIco.position.x = 0;
		bgIco.position.y = 0;

		notif.position.x = ~~(CS.display.width/2 - bgIco.width/2);
		notif.position.y = -bgIco.height;

		var ico = o.sprite;
		ico.scale.x = 0.2;
		ico.scale.y = 0.2;
		ico.position.x = 25;
		ico.position.y = 0;
		var title = new PIXI.BitmapText(o.title.toUpperCase(), { font: "36px VeraBd" });
		title.position.x = ~~(bgIco.width/2 - title.width/2) + 65;
		title.position.y = 20;

		var capitalize = o.description.charAt(0).toUpperCase() + o.description.slice(1);
		var description = new PIXI.BitmapText(capitalize, { font: "30px VeraBd", fill: 0x000000 });
		description.position.x = ~~(bgIco.width/2 - description.width/2) + 65;
		description.position.y = 60;


		notif.addChild(bgIco);
		notif.addChild(ico);

		notif.addChild(title);
		notif.addChild(description);

		var sceneId = Scene.BaseScene.current.id;


		notif.interactive = true;
		notif.mousedown = notif.touchdown = function(){
			notif.interactive = false;

			if(self.tlNotif)
			{
				self.tlNotif.clear();
				self.tlNotif = null;
			}

			TweenMax.to(notif.position, 0.3, {y: -notif.height, onComplete: function(){
				if(Scene.current.id == sceneId) {
					Scene.current.removeChild(notif);
				}

				self._launchNotification();
			}});
		};

		Scene.BaseScene.current.addChild(notif);



		self.tlNotif = new TimelineMax();
		self.tlNotif.to(notif.position, 0.5, {y:0, ease: Bounce.easeOut});
		self.tlNotif.to(notif.position, 0.3, {y:-notif.height}, '+=1.7');
		//
		self.tlNotif.call(function(){
			self.tlNotif = null;
			if(Scene.current.id == sceneId) {
				Scene.current.removeChild(notif);
			}
			self._launchNotification();
		});


	});

	if(this.notifQueue.length == 1 && !self.tlNotif)
	{
		this._launchNotification();
	}


}

// ## LaunchNotification
// Launch the first notication and release it from the notifQueue
Main.prototype._launchNotification = function()
{
	if(!this.notifQueue.length) return;

	var f = this.notifQueue.pop();
	f();

}

exports.Main = Main;

})(window.CS = window.CS || {})
