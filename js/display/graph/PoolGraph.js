'use strict';

// ## PoolGraph class
// It was supposed to be a pool but due to some weird pixi behavior it's not the case anymore.

(function(exports){

// ## Constructor
function PoolGraph()
{

}


// ## GenerateStep
// Geneate one piece to discover, 3 random pieces and 1 compatible piece
PoolGraph.prototype.generateStep = function(mode, ignorePieces, difficulty)
{
	if(!ignorePieces) ignorePieces = {};

	if(difficulty == Scene.GameScene.DIFFICULTY_EASY) {
		this.colorsAllowed = CS.colorsRefMap.easy.slice(0);
		this.symbolsAllowed = CS.symbolsRefMap.easy.slice(0);
	} else {
		this.colorsAllowed = CS.colorsRefMap.hard.slice(0);
		this.symbolsAllowed = CS.symbolsRef.slice(0);
	}


	var response = {
		discover: this.randGraph(ignorePieces),
		pieces: []
	};


	var combinaison = this.generateCombinaison(response.discover, mode);
	var ref = combinaison.ref;

	ignorePieces[ref.toString()] = true;
	ignorePieces[response.discover.toString()] = true;

	var toGenerate = 3;
	var closePiece = null;

	if(difficulty == Scene.GameScene.DIFFICULTY_HARD && mode == Scene.GameScene.SHAPE_MODE) {
		var symbolRefId = ref.getSymbol().slice(-2);
		var firstComp = parseInt(symbolRefId[0], 10);
		var secondComp = parseInt(symbolRefId[1], 10);

		var closeSymbol = ref.getSymbol().slice(0, ref.getSymbol().length-2);

		if(firstComp == 1) {
			closeSymbol += '2';
			closeSymbol += Math.max(secondComp-1, 1);

		} else {
			closeSymbol += '1';
			closeSymbol += Util.Math2.randomInt(secondComp, secondComp+1);
		}

		closePiece = this.randGraph(ignorePieces, null, closeSymbol)

		ignorePieces[closePiece.toString()] = true;

		toGenerate = 2;
	}

	for(var i=0; i<toGenerate; i++)
	{
		var rg = this.randGraph(ignorePieces);

		ignorePieces[rg.toString()] = true;
		response.pieces.push(rg);
	}

	var insertAt = Util.Math2.randomInt(0, response.pieces.length);
	response.pieces.splice(insertAt, 0, ref);

	if(closePiece) {
		insertAt = Util.Math2.randomInt(0, response.pieces.length);
		response.pieces.splice(insertAt, 0, closePiece);
	}


	combinaison.restore.targetMap.push(combinaison.restore.val);

	return response;
}


// ## GenerateCombinaison
// Generate a matchable piece with discover
PoolGraph.prototype.generateCombinaison = function(discover, mode)
{
	var graphRef = null;
	var colorRef = null;
	var symbolRef = null;
	var restore = {
		targetMap: null,
		val: null
	};

	if(mode == Scene.GameScene.COLOR_MODE)
	{
		// The color to discover can't be generate anymore
		var colorIndex = this.colorsAllowed.indexOf(discover.getColor());
		this.colorsAllowed.splice(colorIndex, 1);
		restore.targetMap = this.colorsAllowed;
		restore.val = discover.getColor();

		// Let's find a matchable color
		colorRef = discover.getColor();
		symbolRef = this.randSymbol(discover.getSymbol());
	}
	else
	{
		// The symbol to discover can't be generate anymore
		var symbolIndex = this.symbolsAllowed.indexOf(discover.getSymbol());
		this.symbolsAllowed.splice(symbolIndex, 1);
		restore.targetMap = this.symbolsAllowed;
		restore.val = discover.getSymbol();

		// Let's find a matchable symbol
		colorRef = this.randColor(discover.getColor());
		symbolRef = discover.getSymbol();
	}


	return {
		ref: this.createGraph(colorRef, symbolRef),
		restore: restore
	};
}

// ## CreateGraph
PoolGraph.prototype.createGraph = function(color, symbol)
{
	return new Graph.GraphElement(color, symbol);
}

// ## RandGraph
PoolGraph.prototype.randGraph = function(notInMap, forceColor, forceSymbol)
{
	do
	{
		var symbol = (forceSymbol) ? forceSymbol : this.randSymbol();
		var color = (forceColor) ? forceColor : this.randColor();
		var stringFormat = Graph.GraphElement.stringFormat(color, symbol);
	} while(notInMap && notInMap[stringFormat])

	return this.createGraph(color, symbol);
}

// ## RandColor
PoolGraph.prototype.randColor = function(notEqualTo)
{
	do
	{
		var rI = Util.Math2.randomInt(0, this.colorsAllowed.length-1);
		var color = this.colorsAllowed[rI];
	} while(color == notEqualTo)
	return color;
}

// ## RandSymbol
PoolGraph.prototype.randSymbol = function(notEqualTo)
{
	do
	{
		var rI = Util.Math2.randomInt(0, this.symbolsAllowed.length-1);
		var symbol = this.symbolsAllowed[rI];
	} while(symbol == notEqualTo)

	return symbol;
}

// ## GetGraphs
PoolGraph.prototype.getGraphs = function() { return this.graphs; }

exports.PoolGraph = PoolGraph;

})(window.Graph = window.Graph || {})
