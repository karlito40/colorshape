'use strict';

// ## SplashScene class
// display every splash configure in (*js/config.js*)

(function(exports){

// ## Constructor
function SplashScene()
{
    exports.BaseScene.call(this, 'SplashScene');

    this.splashs = CS.config.splashs.images;
    this.cursor = 0;
    this.displayFor = CS.config.splashs.duration;
}

SplashScene.prototype.constructor = SplashScene;
SplashScene.prototype = Object.create(exports.BaseScene.prototype);

// ## Create
// Just call the next splash and we are good
SplashScene.prototype.create = function()
{
    this.next();
}

// ## Next
// Display the next splash or fire the onEnd event
SplashScene.prototype.next = function()
{
    if(this.cursor >= this.splashs.length) {
        this.onEnd();
        return;
    }

    var useFadeIn = false;
    if(this.bg){
        TweenLite.to(this.bg, CS.config.scene.fadeOut, {alpha: 0});
        useFadeIn = true;
    }

    this.bg =  new PIXI.Sprite(PIXI.Texture.fromFrame(this.splashs[this.cursor]));

    var compare = (CS.display.width > CS.display.height) ? 'width' : 'height';
    if(this.bg[compare] < CS.display[compare]) {
        var ratio = CS.display[compare]/this.bg[compare];
        this.bg.scale.x = ratio;
        this.bg.scale.y = ratio;
    }

    this.bg.anchor.x = 0.5;
    this.bg.anchor.y = 0.5;
    this.bg.alpha = (useFadeIn) ? 0 : 1;
    this.bg.position.x = ~~(CS.display.width/2);
    this.bg.position.y = ~~(CS.display.height/2);

    this.addChild(this.bg);

    if(useFadeIn) {
        TweenLite.to(this.bg, CS.config.scene.fadeOut, {alpha: 1});
    }

    this.cursor++;

    setTimeout(this.next.bind(this), this.displayFor);
}

exports.SplashScene = SplashScene;

})(window.Scene = window.Scene || {})
