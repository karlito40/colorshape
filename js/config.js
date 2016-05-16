'use strict';

// ## Config object
// If you want to configure something in the application... it should be there !

(function(exports){


	// Set your own available languages... it should be the first 2 letters of a locale code country.
	I18N.setAvailableLangs(['fr', 'en']);
	// This lang will be used if the user lang is not defined in the array defined above.
	I18N.setDefaultLang('fr');
	// Initialize our lang
	I18N.initLang((navigator.language) ? navigator.language.slice(0, 2) : null);

	// Define every text here and use the I18N.get with their respectively key.
	I18N.setTrad({
		test: {
			fr: 'Yolo :x',
			en: 'Hello'
		},

		slide_to_play: {
			fr: 'Glisser pour jouer',
			en: 'Slide to play'
		},

		match_symbols: {
				fr: 'Associer symboles',
				en: 'Match symbols'
		},

		match_colors: {
			fr: 'Associer couleurs',
			en: 'Match colors'
		},

		game_center_disabled: {
			fr: 'Game Center désactivé',
			en: 'Game Center disabled'
		},

		game_center_signin: {
			fr: "Connectez vous au Game Center pour l'activer",
			en: 'Sign in with the Game Center application to enable it'
		},

		best_score: {
			fr: 'Meilleur score: :x',
			en: 'Best score: :x'
		},

		game_played: {
			fr: 'Parties jouees: :x',
			en: 'Game played: :x'
		},

		share_text : {
			fr: "J'ai fait :x points sur Colored Shapes ! Peux tu faire mieux ? http://itunes.apple.com/app/id937159750",
			en: "I scored :x points on Colored Shapes! Can you do better? http://itunes.apple.com/app/id937159750"
		},

		ok: {
			fr: 'Ok',
			en: 'Ok'
		},

		cancel: {
			fr: 'Annuler',
			en: 'Cancel'
		},

		loading: {
			fr: 'Chargement...',
			en: 'Loading...'
		},

		restore_inapp: {
			fr: "Restaurer achat",
			en: "Restore in-app"
		},

		remove_ads: {
			fr: "Supprimer pub",
			en: "Remove ads"
		}

	});

	// ### App configuration
	exports.config = {
		// App size by default (will be scale by the screen height)
		app: {
			width: 768,
			height: 1363
		},

		// **Very important**; you must set it to **false** before any **production** release
		store: {
			sandbox: false
		},

		// Set test to true to activate ads (even if you pourchased the no-ads item)
		ads: {
			removeAdsId: 'com.3dduo.coloredshapes.removeads',
			show: true,
			test: false,
			interstitial: {
				ready: false,
				// Our interstitial will be fire each 4 games (4, 8, 12, ...)
				eachGame: 2,
				// You don't need to set this
				current: 0
			}
		},

		gameCenter: {
			packagePref: 'com.3dduo.coloredshapes.'
		},

		// Defined the scene transition duration; feel free to tweak the number (this is in second). In this example fadeOut is equal to 200ms
		scene: {
			fadeIn: 1.2,
			fadeOut: 0.2
		},

		// Switch for the images you want (if you have the right to do it.. not sure)
		splashs: {
			images: ["resources/splash-F4F.jpg", "resources/splash-3dduo.jpg"],
			duration: 1400
		},

		// This is about the buttons display on the end game (how fast do they go to 0 -> 1 in opacity)
		gameScene: {
			animUIDuration: 0.7
		},

		// ## In game
		levelDesign: {
			// When will the color be unlocked ?
			colorAt: 5,
			// They are unlocked with a *100* percent probability
			colorPercent: 100,
			// This probability is decrement each time by *20* percent until we switch to the symbol mode.
			colorPercentDecrBy: 20,
			// We have *6* seconds in total
			timeLimit: 6,
			// But we gain *750ms* on a guess
			timeGain: 0.75
		},

		// This is just an url
		F4FUrl: 'http://www.appstore.com/3dduo'



	};





	exports.display = {
		width: exports.config.app.width,
		height: exports.config.app.height,
	}


	exports.lastScore = 0;
	exports.launch = 0;

	exports.scale = 1;

	// ## Storage
	// Here is the storage we use by default.
	// Polyfill if it's not available just to avoid bug
	exports.storage = localStorage;

	if(typeof exports.storage == "undefined")
	{
		exports.storage = {
			map: {},
			setItem: function(key, value){
				this.map[key] = value;
			},

			getItem: function(key) {
				return this.map[key];
			}

		};
	}

	// ## Assets
	// Stuff to load
	exports.manifest = [
		"resources/graph.json",
		"resources/common.json",
		"resources/SmallArrowTrail.png",
		"resources/CircleTrail.png",
		"resources/bg-white-circle.png",
		"resources/VeraBd.fnt",
		"resources/CocoPuff-Regular.fnt",
		"resources/ach_banner.png",
		"resources/splash-F4F.jpg",
		"resources/splash-3dduo.jpg"
	];

	// ## Achievements
	var achievements = {
		games: {},
		points: {},
		colors: {},
		symbols: {}
	};

	achievements.games[5] = true;
	achievements.games[10] = true;
	achievements.games[20] = true;
	achievements.games[40] = true;
	achievements.games[80] = true;
	achievements.games[150] = true;
	achievements.games[300] = true;
	achievements.games[600] = true;
	achievements.games[1250] = true;
	achievements.games[2500] = true;

	achievements.points[10] = true;
	achievements.points[20] = true;
	achievements.points[30] = true;
	achievements.points[40] = true;
	achievements.points[50] = true;
	achievements.points[60] = true;
	achievements.points[70] = true;
	achievements.points[80] = true;
	achievements.points[90] = true;
	achievements.points[100] = true;

	achievements.colors[20] = true;
	achievements.colors[80] = true;
	achievements.colors[240] = true;
	achievements.colors[640] = true;
	achievements.colors[1600] = true;
	achievements.colors[3600] = true;
	achievements.colors[8400] = true;
	achievements.colors[19200] = true;
	achievements.colors[45000] = true;
	achievements.colors[100000] = true;

	achievements.symbols[20] = true;
	achievements.symbols[80] = true;
	achievements.symbols[240] = true;
	achievements.symbols[640] = true;
	achievements.symbols[1600] = true;
	achievements.symbols[3600] = true;
	achievements.symbols[8400] = true;
	achievements.symbols[19200] = true;
	achievements.symbols[45000] = true;
	achievements.symbols[100000] = true;


	exports.achievements = achievements;




	var difficulties = {
		easy: {
			quantity: 4,
			id: 1
		},
		hard: {
			quantity: 3,
			id:2
		}
	};

	exports.colorsRefMap = {
		easy: ['fec400', '02ad00', 'e50100', '1b5df2'],
		hard: ['2f9cfb', '7238c2', '283756', 'ff6100', 'f04297']
	};
	exports.colorsRef = [];
	for(var key in exports.colorsRefMap){
		var tab = exports.colorsRefMap[key];

		tab.forEach(function(val){
			exports.colorsRef.push(val);
		});
	}


	exports.symbolsRefMap = {
		easy: [],
		hard: []
	};
	exports.symbolsRef = [];


	['barre', 'carre', 'cercle', 'triangle'].forEach(function(val){
		Util.Object2.each(difficulties, function(difficulty, key){

			for(var i=0; i<difficulty.quantity; i++){
				var s = 's-' + val + '-' + difficulty.id + (i+1);
				exports.symbolsRef.push(s);
				exports.symbolsRefMap[key].push(s);
			}

		});
	});

})(window.CS = window.CS || {})
