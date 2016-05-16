# Hello guys !

This documentation will help you to dive into my game jam code. It can be very awfull sometimes but i'm sure you will be
able to understand the main idea.

Colored Shapes is divided into 7 namespaces.

* **window.Util** which is a group of helpers.
* **window.I18N** handle the traduction.
* **window.Mobile** which is supposed to communicate with the native mobile APIs.
* **window.Graph** which is used to generate symbols.
* **window.UI** which regroup every elements render to the screen.
* **window.Scene** which basically represent the current display.
* **window.CS** is the main entry point. Every events related to our app should be stored here (configuration, player...).

## Global explanation

Colored Shapes is launch through the **index.html** then execute a **new Main** process when every script has been loaded. The Main will create a **new Canvas** and adjust it accordingly to the device. On a side note he will also log the user to the **game center** and initialize **ads**. Now that everything is ready the splashs will be fire and the game will **start**.

We join a configuration file system for your need in *js/config.js*. It is important to note that **you have to switch sandbox to false** before
any **production** release. This file is well documented so please don't hesitate to read it.

Meanwhile, if you have to create a **new Scene**, don't panic ! It's very easy (it's still a game jam code though...). Here is an exemple:

<pre>
  // name the scene class whatever you want
  function TestExampleScene() {
      // It's important to call the BaseScene which handle everything for us
      Scene.BaseScene.call(this, 'TestExampleScene');

      // add your own properties here
      this.someVar = "myThing";
      this.stuff = ["doStuff"];
  }

  // Extends our BaseScene
  TestExampleScene.prototype.constructor = TestExampleScene;
  TestExampleScene.prototype = Object.create(Scene.BaseScene.prototype);

  // Add your logic in this function. It will be fire on the opening.
  TestExampleScene.prototype.logic = function() {}

  // Now you can use this scene as follow
  var myScene = new TestExampleScene();
  myScene.start();  // it will automatically close the last opened scene.

</pre>
As a side note we can give you a more powerful system with a view builder and thing like that.

We can also provide some jasmine or mocha test if you are afraid to broke something.

## Map

The code has been documented as much as possible. Don't hesitate to browse this map for further details.

* **window.CS**
  * [js/config.js](js/config.js.html) Configuration
  * [js/PlayerInfo.js](js/PlayerInfo.js.html) Player (score, highscore, ...)
  * [js/Main.js](js/Main.js.html) App entry point
* **window.I18N**
  * [js/i18n/translate.js](js/i18n/translate.js.html) Translation
* **window.Mobile**
  * [js/mobile/GameCenter.js](js/mobile/GameCenter.js.html) GameCenter
  * [js/mobile/Store.js](js/mobile/Store.js.html) In-App
* **window.Graph**
  * [js/display/graph/PoolGraph.js](js/display/graph/PoolGraph.js.html) Holds GraphElement
  * [js/display/graph/GraphElement.js](js/display/graph/GraphElement.js.html) Hold Symbol
  * [js/display/graph/Symbol.js](js/display/graph/Symbol.js.html)
* **window.Scene**
  * [js/display/scene/BaseScene.js](js/display/scene/BaseScene.js.html) To extends
  * [js/display/scene/GameScene.js](js/display/scene/GameScene.js.html)
  * [js/display/scene/SplashScene.js](js/display/scene/SplashScene.js.html)
* **window.UI**
  * [js/display/ui/common/Button.js](js/display/ui/common/Button.js.html)
  * [js/display/ui/common/Logo.js](js/display/ui/common/Logo.js.html)
  * [js/display/ui/common/Menu.js](js/display/ui/common/Menu.js.html)
  * [js/display/ui/game/CircleSwipe.js](js/display/ui/game/CircleSwipe.js.html)
  * [js/display/ui/game/Match.js](js/display/ui/game/Match.js.html)
  * [js/display/ui/game/MatchContainer.js](js/display/ui/game/MatchContainer.js.html)
  * [js/display/ui/game/Stat.js](js/display/ui/game/Stat.js.html)
* **window.Util**
  * [js/util/common/Color.js](js/util/common/Color.js.html)
  * [js/util/common/Math2.js](js/util/common/Math2.js.html)
  * [js/util/common/Object2.js](js/util/common/Object2.js.html)
  * [js/util/common/String2.js](js/util/common/String2.js.html)
  * [js/util/control/Swipe.js](js/util/control/Swipe.js.html)
  * [js/util/display/DisplayObject.js](js/util/display/DisplayObject.js.html)

## Translate

Open **js/config.js** and look at these lines

<pre>
  I18N.setAvailableLangs(['fr', 'en']);
  I18N.setDefaultLang('fr');
  I18N.initLang((navigator.language) ? navigator.language.slice(0, 2) : null);
  I18N.setTrad({
    test: {
      fr: 'Bonjour :x :y',
      en: 'Hello'
    },
    another_thing: {
      fr: "Quelque choe d'autre",
      en: 'Another thing'
    }
  });
</pre>

You will have to set the default lang and the available languages with whatever you want. Next, define your translation in setTrad as i did above. Now you should be able to call a text by using

<pre>
  I18N.get('another_thing') // will return "Quelque choe d'autre" or "Another thing"
  I18N.get('test' {
    ':x': 'Bob',
    ':y': 'replace !'
  }) // return 'Bonjour Bob !' or 'Hello'
</pre>

## Library

#### CocoonJS

[CocoonJS](https://www.ludei.com/cocoonjs/) is like cordova/phonegap expect that it's dedicated to html5 games.

First, you'll have to create an account.

To easily test your app you can download the cocoonjs launcher on the appstore here
[https://itunes.apple.com/fr/app/cocoonjs-by-ludei/id519623307?mt=8](https://itunes.apple.com/fr/app/cocoonjs-by-ludei/id519623307?mt=8) or for android [https://play.google.com/store/apps/details?id=com.ideateca.cocoonjslauncher&hl=fr_FR](https://play.google.com/store/apps/details?id=com.ideateca.cocoonjslauncher&hl=fr_FR). Next, make a zip of your application and export it to your mobile. On android, you can just place it on the root of your device. On iOS, you'll have to use iTunes and then share the zip with cocoonjs launcher app.

Unfortunately, the default cocoonjs launcher does not let you test ads and in-app functionality. You'll have to use your own compiler but it's not that complicated.
First, ask a premium account to ludei by filling their form. Next, go to the compile launcher thing and create a launcher (this is available only if you have a premium account). Install this launcher on your device and now you will able to use their [plugins](https://github.com/ludei/cocoonjs-plugins) (in-app, ads, ...)


You are also supposed to have a mopub account to used ads. So go to [mopub](http://www.mopub.com/) Register some AdMob or millenial media ads and retrieve their Ad Unit ID. Next, in your ludei cloud compiler, go to configuration, select "Ads" and enter your ads unit ID. This is all. Cocoon will handle the rest for us.

Finally, we can also publish our app with the ludei cloud compiler.
* Select general, check no scale mode and portrait orientation.
* Then select iOS/Android and enter your required and optional assets.
* Next go to compile project and you will be able create an apk or/and and xcode project.



#### PixiJS

PixiJS is a webGL renderer. You can find more informations on their website [http://www.pixijs.com/ ](http://www.pixijs.com/)
[http://www.goodboydigital.com/pixijs/docs/ ](http://www.goodboydigital.com/pixijs/docs/)

If you have to add a lot of images, just download [texturepacker](https://www.codeandweb.com/texturepacker), create a JSON (Hash project). Then use the json export with pixi as i did.

#### Animation

Animations are done with greensock. Feel free to check their doc for more information [https://greensock.com/get-started-js](https://greensock.com/get-started-js).

## Contact

If you have any questions and/or concerns, please don't hesitate to contact us.
