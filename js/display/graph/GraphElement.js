'use strict';

// ## GraphElement class
// A GraphElement is a circle background associate with a symbol

(function(exports){

// ## Constructor
function GraphElement(color, symbol)
{
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame("circle-" + color));

    if(symbol)
    {
        this.symbolLayer = new Graph.Symbol(symbol);
        this.addChild(this.symbolLayer);
    }

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.color = color;
    this.id = GraphElement.ids++;

}

GraphElement.constructor = GraphElement;
GraphElement.prototype = Object.create(PIXI.Sprite.prototype);

// ## StringFormat
GraphElement.stringFormat = function(color, symbol) { return color + "-" + symbol; }
GraphElement.ids = 0;

// ## GetId
GraphElement.prototype.getId = function(){ return this.id; }
// ## ToString
GraphElement.prototype.toString = function() { return GraphElement.stringFormat(this.color, this.getSymbol()); }
// ## GetColor
GraphElement.prototype.getColor = function(){ return this.color; }
// ## GetSymbol
GraphElement.prototype.getSymbol = function(){
    if(!this.symbolLayer) return '';
    return this.symbolLayer.getSymbol();
}

exports.GraphElement = GraphElement;

})(window.Graph = window.Graph || {})
