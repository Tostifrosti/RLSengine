/* 
	@author RLSmedia, Rick Smeets
*/

function Display(canvas) {
	this.canvas = canvas;
	this.canvas.width = 1280;
	this.canvas.height = 720;
	this._screen = null;
	this.screen = {};
	this.screen.width = 0;
	this.screen.height = 0;
	this._init();
}

Display.prototype._init = function() {
	this.screen.width = window.innerWidth;
	this.screen.height = window.innerHeight;

	window.addEventListener('resize', this.resize, false);
	window.addEventListener('orientationchange', this.resize, false);

	window.addEventListener('focus', this.focus, false);
};

Display.prototype.setScreen = function(s) {
	if(typeof(s) !== "undefined" && s !== null) { 
		this._screen = s;
	} else {
		console.error("Givin screen is undefined");
		this._screen = null;
	}
};

Display.prototype.resize = function() {
	//TODO: scaleing & resizing
};

Display.prototype.focus = function() {
	//TODO: focus
};

/*function initWebGl() {
	gl = null;
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch(e) {}

	if(!gl) {
		alert("Unable to initialize WebGl. Your browser may not support it.");
		gl = null;
	}
	return gl;
};


function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var lines = text.split('\n');
	for(var l = 0; l < lines.length; ++l)
	{
		var words = lines[l].split(' ');
		var line = '';
	
		for(var i=0; i<words.length; i++) {
			var testLine = line + words[i] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > maxWidth && i > 0) {
				context.fillText(line, x, y);
				line=words[i] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		
		y += lineHeight;
	}
};
*/