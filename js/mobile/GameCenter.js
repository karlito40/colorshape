'use strict';

// ## GameCenter static class

(function(exports){

exports.GameCenter = {
    socialService: null,
    waitingLogin: false,
    isConnect: false,

    achievementsRef: {},

    // ## PromptLogin
    // ask the user to enable the game center
    promptLogin: function() {
        Cocoon.Dialog.confirm({
            title: I18N.get('game_center_disabled'),
            message: I18N.get('game_center_signin'),
            confirmText: I18N.get('ok'),
            cancelText: I18N.get('cancel')
        }, function(accepted){
            if(accepted) Cocoon.App.openURL('gamecenter:');
        });
    },

    // ## Login
    // Log the user to the game center.
    // Prompt the login when the user
    // ask for something (leaderboard, ...) and he's not
    // already log in.
    login: function(autoConnect) {
        console.log('GameCenter::login called');
        var self = this;
        var socialService = this.getSocialService();
        if(socialService && !this.observeLoginChanged) {
            console.log('loginStatusChanged add');
            socialService.on('loginStatusChanged', function(loggedIn, error){
                self.isConnect = loggedIn;
                console.log('self.isConnect', self.isConnect);
                if(self.isConnect) {
                    self.loadAchievements();
                }
            });

            this.observeLoginChange = true;
        }

        if(!socialService || this.waitingLogin) return;
        this.waitingLogin = true;

        socialService.login(function(loggedIn, error){
            if(!loggedIn) {
                console.log('Login failed', JSON.stringify(error));

                if(!autoConnect && error && error.code == 2){
                  self.promptLogin();
                }
            } else {
                self.isConnect = true;
                self.loadAchievements();
            }

            self.waitingLogin = false;

        });

    },
    // ## Request
    // Ask for something (achievements, ...) and automatically log the user if we can.
    // Otherwise we will do a promptLogin
    request: function(cmd){
        if(!this.isConnect) {
            this.login(false);
            return;
        }

        cmd();
    },

    // ## LoadAchievements
    loadAchievements: function() {
        if(!Cocoon.Social.GameCenter.nativeAvailable) return;

        Cocoon.Social.GameCenter.loadAchievements(function(achievements, error){
        	if(error) {
                console.log('loadachievements error', JSON.stringify(error));
                return;
            }

            CS.PlayerInfo.integrateAchievements(achievements);
        });

        var self = this;
        Cocoon.Social.GameCenter.loadAchievementDescriptions(function(achievements){
            for(var i=0; i<achievements.length; i++) {
                var ach = achievements[i];
                self.achievementsRef[ach.identifier] = {
                    description: ach.achievedDescription,
                    title: ach.title
                }
            }
        });

    },

    // ## GetAchievement
    getAchievement: function(identifier) {
        return (this.achievementsRef[identifier]) ? this.achievementsRef[identifier] : false;
    },

    // ## GetSocialService
    // return an interface which will help us to integrate everything
    getSocialService: function(){
        if(!this.socialService && Cocoon.Social.GameCenter.nativeAvailable){
            var gc = Cocoon.Social.GameCenter;
            this.socialService = gc.getSocialInterface();
        }

        return this.socialService;

    },

    // ## ShowLeaderboard
    showLeaderboard: function(){
        var self = this;

        this.request(function(){
            self.getSocialService().showLeaderboard();
        });

    },

    // ## SubmitScore
    // Send a score
    submitScore: function(score){
        if(!this.isConnect) return;


        this.getSocialService().submitScore(score, function(error) {
            if (error) {
                console.error("Error submitting score: " + error);
            } else {
                console.log("Score submitted!");
            }
        });
    }


}

})(window.Mobile = window.Mobile || {} )
