'use strict';

// ## PlayerInfo static class
// The PlayerInfo use the storage defined in **js/config.js** to save some specific data to the user (achievements, highscore, ...).
// He is also responsible to check and submit every achievements unlocked to the game center.
// By default we use the localStorage
(function(exports){


exports.PlayerInfo = {
	achievements: {},
	sound: null,

	addPurchase: function(orderId){
		CS.storage.setItem(orderId, true)
	},

	hasPurchase: function(orderId){
		return CS.storage.getItem(orderId);
	},

	setSound: function(sound){
		CS.storage.setItem('sound', sound);
		this.sound = sound;
	},

	getSound: function(){
		if(this.sound != null) return this.sound;

		var sound = CS.storage.getItem('sound');
		if(sound){
			sound = (sound == "true") ? true : false;
		}

		this.sound = sound;
		return sound;
	},

	// ## GetHighscore
	// return the highest score done
	getHighscore: function() {
		var h = CS.storage.getItem('highscore') || 0;
		return parseInt(h, 10);
	},

	// ## SetHighscore
	// Save the highest score done
	setHighscore: function(value) {
		return CS.storage.setItem('highscore', value);
	},

	// ## GetGamePlayed
	// return the number of games played
	getGamePlayed: function(){
		var h = CS.storage.getItem('gameplayed') || 0;
		return parseInt(h, 10);
	},

	// ## SetGamePlayer
	// save the number of games played
	setGamePlayed: function(value){
		return CS.storage.setItem('gameplayed', value);
	},

	// ## IncrGamePlayed
	// Increment the number of games played and save it
	incrGamePlayed: function(){
		var nbPlayed = this.getGamePlayed();
		this.setGamePlayed(++nbPlayed);
	},

	// ## IncrColorMatch
	// Increment the color match sum
	incrColorMatch: function(by){
		var nbColorMatch = this.getColorMatch();
		this.setColorMatch(nbColorMatch+by);
	},

	// ## GetColorMatch
	// return the color match sum
	getColorMatch: function(){
		var h = CS.storage.getItem('colormatch') || 0;
		return parseInt(h, 10);
	},

	// ## GetColorMatch
	// save the color match sum
	setColorMatch: function(value) {
		return CS.storage.setItem('colormatch', value)
	},

	// ## IncrSymbolMatch
	// Increment the symbol match sum
	incrSymbolMatch: function(by){
		var nbSymbolMatch = this.getSymbolMatch();
		this.setSymbolMatch(nbSymbolMatch+by);
	},

	// ## GetSymbolMatch
	// return the symbol match sum
	getSymbolMatch: function(){
		var h = CS.storage.getItem('symbolmatch') || 0;
		return parseInt(h, 10);
	},

	// ## SetSymbolMatch
	// save the symbol match sum
	setSymbolMatch: function(value) {
		return CS.storage.setItem('symbolmatch', value)
	},

	// ## IntegrateAchievements
	// recreate our achievements done with a achievementsList given by the game center
	integrateAchievements: function(achievementsList){
		var self = this;
		achievementsList.forEach(function(val){
			self.addAchievement(val.identifier);
		});

	},

	// ## AddAchievements
	// Add an achievement completed to our locale achievements map
	addAchievement: function(achievementID) {
		this.achievements[achievementID] = true;
	},


	// ## UnlockAchievement
	// Unlock an achievement if possible
	unlockAchievement: function(type, total)
	{
		var identifierID = type;

		var hasTotal = false;
		if(typeof total != "undefined") {
				identifierID = total.toString() + type;
				hasTotal = true;
		}

		identifierID = CS.config.gameCenter.packagePref + identifierID;

		if(this.hasAchievement(identifierID)) return; // succes deja debloque

		if(hasTotal) {
			if(!CS.achievements[type]) return;

			var cfAchievement = CS.achievements[type];

			for(var points in cfAchievement) {
				if(parseInt(points, 10) > total) break;

				var buildIdentifierID = CS.config.gameCenter.packagePref + points.toString() + type;
				if(!this.hasAchievement(buildIdentifierID)) {
					this.submitAchievement(buildIdentifierID);
				}
			}
		} else {
			this.submitAchievement(identifierID);

		}


	},

	// ## HasAchievement
	// Check if the given achievenetID has already be unlocked
	hasAchievement: function(identifierID) {
		return (this.achievements[identifierID]);
	},

	// ## SubmitAchievement
	// Send an achievement to the game center.
	submitAchievement: function(identifierID){
		this.addAchievement(identifierID);

		console.log('submitAchievement', identifierID);
		if(this.onNewAchievement) this.onNewAchievement(identifierID);

		if(!Mobile.GameCenter.getSocialService()) return;

		Mobile.GameCenter.getSocialService().submitAchievement(identifierID, function(error){
			if(error) console.log('error submitAchievement ' + identifierID, JSON.stringify(error));
			else console.log('achievement unlocked', identifierID);
		});
	}


}


})(window.CS = window.CS || {})
