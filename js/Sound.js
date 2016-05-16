'use strict';

(function(exports){

var Sound = {
  availableSound: {},
  toLoad: [],
  nbLoad: 0,

  prepareLoad: function(toLoad){
    this.toLoad = toLoad;
  },

  load: function(onload, oncomplete){
    console.log('load sound');
    // if (!buzz.isSupported()) {
    //   console.log('buzz is not isSupported')
    //   return;
    // }
    var self = this;
    this.nbLoad = 0;

    for(var i=0; i<this.toLoad.length; i++) {
      var o = this.toLoad[i];
      var src = self.url(o.name);
      var mySound = new Audio();
      mySound.src = src;

      if(o.loop) {
        mySound.loop = true;
      }
      mySound.volume = 1;
      //mySound.load();
      self.availableSound[o.name] = {
        sound: mySound,
        data: o
      };
      onload(o.name, mySound);

    }

    oncomplete();
  },

  play: function(name) {
    if(!CS.PlayerInfo.getSound()) return false;

    if(!this.availableSound[name] || this.availableSound[name].sound.isPlaying) return;
    this.availableSound[name].sound.isPlaying = true;

    this.availableSound[name].sound.play();


  },

  fxPlay: function(name) {
    if(!CS.PlayerInfo.getSound()) return false;

    this.availableSound[name].sound.currentTime = 0;
    this.availableSound[name].sound.play();

    // var src = this.url(name);
    // var mySound = new Audio();
    // mySound.src = src;
    //
    // mySound.play();
    //
    // return mySound;
  },

  stop: function(name) {
    if(!CS.PlayerInfo.getSound() || !this.availableSound[name].sound.isPlaying) return false;

    this.availableSound[name].sound.isPlaying = false;
    this.availableSound[name].sound.pause();
  },

  stopAll: function() {
    for(var name in this.availableSound) {
      this.stop(name);
    }

  },

  url: function(name){
    return 'resources/sounds/'+name+'.ogg';
  }

}

exports.Sound = Sound;

}) (window.CS = window.CS || {})
