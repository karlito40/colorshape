var SoundHelper = {
	availableSound: {},
	toLoad: [],
	nbLoad: 0,

	prepareLoad: function(toLoad){
		this.toLoad = toLoad;
	},

	load: function(onload, oncomplete){
		console.log('load sound');
		if (!buzz.isSupported()) {
			console.log('buzz is not isSupported')
			return;
		}
		var self = this;

		this.nbLoad = 0;

		for(var i=0; i<this.toLoad.length; i++) {
			var o = this.toLoad[i];
			var src = UrlHelper.getSound(o.name);
			var mySound = new buzz.sound(src);

			mySound.bind('loadeddata', function(currentObject, cSound){
				return function(e){
					self.availableSound[currentObject.name] = {
						sound: cSound,
						data: currentObject
					};
					onload(currentObject.name, cSound);

					self.nbLoad++;
					if(self.nbLoad == self.toLoad.length) {
						oncomplete();
					}
				}
			}(o, mySound))
			.bind('error', function(currentObject, cSound){
				return function(e){
					self.nbLoad++;
					if(self.nbLoad == self.toLoad.length) {
						oncomplete();
					}
				}
			}(o, mySound));

			mySound.load();

		}
	},

	play: function(name) {
		if(!App.getPlayer().sound) return;

		if(!this.availableSound[name] || this.availableSound[name].sound.atwPlaying) return;

		this.availableSound[name].sound.atwPlaying = true;

		this.availableSound[name].sound.fadeIn();
		if(this.availableSound[name].data.loop) {
			this.availableSound[name].sound.loop();
		}

	},

	fxPlay: function(name) {
		if(!App.getPlayer().sound) return false;
		// this.availableSound[name].sound.play();

		var src = UrlHelper.getSound(name);
		var mySound = new buzz.sound(src);
		mySound.play();

		return mySound;
	},

	stop: function(name) {
		if(!this.availableSound[name] || !this.availableSound[name].sound.atwPlaying) return;

		this.availableSound[name].sound.atwPlaying = false;
		this.availableSound[name].sound.fadeOut();
		/*var self = this;
		setTimeout(function(){
			self.availableSound[name].sound.stop();
		}, 5000);
*/
	},

	stopAll: function(name) {
		for(var name in this.availableSound) {
			this.stop(name);
		}

		// buzz.all.stop();
	}
}