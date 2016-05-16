'use strict';

(function(exports){

exports.DisplayObject = {
	center: function(dispayObject)
	{
		dispayObject.anchor.x = 0.5;
		dispayObject.anchor.y = 0.5;
		dispayObject.position.x = ~~(CS.display.width/2);
		dispayObject.position.y = ~~(CS.display.height/2);
	}
}

})(window.Util = window.Util || {})