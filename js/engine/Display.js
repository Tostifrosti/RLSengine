/* 
	@author RLSmedia, Rick Smeets
*/

"use strict";

function Display(canvas, context, width, height) {
	this.canvas = canvas;
	this.context = context;
	this.canvas.width = width || 1280;
	this.canvas.height = height || 720;
	this.canvas.getWidth = function() {
		return width || 1280;
	};
	this.canvas.getHeight = function() {
		return height || 720;
	};

	this.screen = {};
	var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	this.screen.width = screenWidth;
	this.screen.height = screenHeight;
	this.screen.getWidth = function(){
		return screenWidth;
	};
	this.screen.getHeight = function(){
		return screenHeight;
	};
	
	this.scale = {x:1.0, y:1.0};
	this._screen = null;
	this.webglenabled = false;
	

	window.addEventListener('resize', this.resize, false);
	window.addEventListener('orientationchange', this.resize, false);

	window.addEventListener('focus', this.focus, false);
	
	this.initContext("2d", { alpha: false });
}

Display.prototype.setScreen = function(s) {
	if(typeof(s) !== "undefined" && s !== null) {
		this._screen = s;
	} else {
		console.error("Givin screen is undefined");
		this._screen = null;
	}
};
Display.prototype.stop = function()
{
	window.removeEventListener('resize', this.resize, false);
	window.removeEventListener('orientationchange', this.resize, false);
	window.removeEventListener('focus', this.focus, false);

};

Display.prototype.resize = function() {
	window.scrollTo(0,1);

	//Resize canvas
	RLSengine.Display.screen.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	RLSengine.Display.screen.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	var scaleX = (RLSengine.Display.screen.width / RLSengine.Display.canvas.width);
	var scaleY = (RLSengine.Display.screen.height / RLSengine.Display.canvas.height);

	if(scaleX <= scaleY) {
		//scaleY = scaleX;
		scaleY = (RLSengine.Display.screen.height / RLSengine.Display.canvas.height)
		RLSengine.Display.canvas.style.marginTop = '0px';
		RLSengine.Display.canvas.style.marginLeft = '0px';
	} else {
		//scaleX = scaleY;
		scaleX = (RLSengine.Display.screen.width / RLSengine.Display.canvas.width);
		RLSengine.Display.canvas.style.marginTop = '0px';
		RLSengine.Display.canvas.style.marginLeft = ((RLSengine.Display.screen.width - (RLSengine.Display.canvas.width*scaleX)) /2) + 'px';
	}

	
	RLSengine.Display.canvas.width *= scaleX;
	RLSengine.Display.canvas.height *= scaleY;

	RLSengine.Display.scale.x = (RLSengine.Display.canvas.getWidth() / RLSengine.Display.canvas.width);
	RLSengine.Display.scale.y = (RLSengine.Display.canvas.getHeight() / RLSengine.Display.canvas.height);

	//Mouse for posX & posY ??

	//Maybe give commando to Animation to resize its values...

};

Display.prototype.focus = function() {
	//TODO: focus
};


Display.prototype.update = function() {
	if(typeof(this._screen) !== "undefined" && this._screen !== null)
		this._screen.update();
};

Display.prototype.draw = function() {
	if(!this.webglenabled) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	} else {
		this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	}

	if(typeof(this._screen) !== "undefined" && this._screen !== null) {
		this._screen.draw();
	}
};

//	options "2d": alpha:bool, (Gecko only) willReadFrequently:bool, (Blink only) storage:string
//	options "webgl": alpha:bool, depth:bool, stencil:bool, antialias:bool, premultipliedAlpha:bool, preserveDrawingBuffer:bool;
Display.prototype.initContext = function(ctx, options) {
	var ctx = ctx.toLowerCase() || "2d";
	var options = options || {};
	if (this.canvas.getContext) {
		if(ctx === "2d") {
			try {
				this.context = this.canvas.getContext("2d", options);
				this.webglenabled = false;
			} catch(e) { console.error("No support for 2d!"); }
		} 
		else if(ctx === "webgl" || ctx === "3d") {
			try {
				this.context = this.canvas.getContext('webgl', options);
				this.webglenabled = true;
			} catch(e) { console.error("No support for webgl!"); }
		
			try {
				this.context = this.canvas.getContext('experimental-webgl', options);
				this.webglenabled = true;
			} catch(e) { console.error("No support for experimental-webgl!"); }
			/*try {
				context = canvas.getContext('experimental-webgl2', options);
				if(context) { return context; }
			} catch(e) { console.error("No support for experimental-webgl2!"); }*/
			
			if(this.context) {
				//Basic gl setup
				this.context.clearColor(0.0, 0.0, 0.0, 1.0);
				this.context.clearDepth(1.0);
				this.context.enable(this.context.DEPTH_TEST);
				this.context.depthFunc(this.context.LEQUAL);
				this.context.viewport(0, 0, this.canvas.width, this.canvas.height);

				//Setup GLSL program
				/*this.vertexShader = createShaderFromScriptElement(this.context, "2d-vertex-shader");
				this.fragmentShader = createShaderFromScriptElement(this.context, "2d-fragment-shader");
				this.program = createProgram(this.context, this.vertexShader, this.fragmentShader);
				this.context.useProgram(this.program);*/
			}
		}
	}
}

//Draw
Display.prototype.clearScreen = function() {
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
Display.prototype.clearRect = function(x, y, width, height) {
	if(!this.webglenabled) {
		this.context.clearRect(x / this.scale.x, y / this.scale.y, width / this.scale.x, height / this.scale.y);
	}
};

Display.prototype.drawText = function(x, y, text, color, size, font) {
	if(!this.webglenabled) {
		var fontSize = 0;
		if(this.scale.x <= this.scale.y) 
			fontSize = (size || 16) / this.scale.y;
		else 
			fontSize = (size || 16) / this.scale.x;
		
		font = font || "Calibri";
		color = color || "#000";
		this.context.font = fontSize + "px " + font;
		this.context.fillStyle = color;
		this.context.fillText(text, (x - (this.context.measureText(text).width/2) * this.scale.x) / this.scale.x, (y + (fontSize/4) * this.scale.y) / this.scale.y);
	}
};
Display.prototype.drawArc = function(xCenter, yCenter, radius, startAngle, endAngle, countclockwise, color, lineWidth, lineCap)
{
	/* 
		   1.5
		1       0
		   0.5
		everything * Math.PI, Max: 2.0, Min: 0.0
	*/

	countclockwise = countclockwise || false; //optional
	lineWidth = lineWidth || 1;  //optional
	lineCap = lineCap || 'square'; //optional, options: butt, round, square
	var scale = (this.scale.x >= this.scale.y) ? this.scale.x : this.scale.y;

	this.context.beginPath();
	this.context.arc(xCenter / this.scale.x, yCenter / this.scale.y, radius / scale, startAngle, endAngle, countclockwise);
	this.context.lineWidth = lineWidth;
	this.context.lineCap = lineCap;
	this.context.strokeStyle = color;
	this.context.stroke();
};
Display.prototype.fillRect = function(x, y, w, h, color, alpha, angle) {
	if(!this.webglenabled) {
		if(angle !== null && angle !== "undefined" && typeof angle === "number")
		{
			this.context.save();
			this.context.translate((x + (w/2)) / this.scale.x, (y + (h/2)) / this.scale.y);
			this.context.rotate(angle * Math.TO_RADIANS);
			if(alpha !== null && alpha !== "undefined" && alpha >= 1.0)
			{
				this.context.globalAlpha = alpha;
				this.context.fillStyle = color;
				this.context.fillRect(-((w/2) / this.scale.x), -((h/2) / this.scale.y), w / this.scale.x, h / this.scale.y);
				this.context.globalAlpha = 1.0;
			} else {
				this.context.fillStyle = color;
				this.context.fillRect(-((w/2) / this.scale.x), -((h/2) / this.scale.y), w / this.scale.x, h / this.scale.y);
			}
			this.context.restore();
		} else {
			if(alpha !== null && alpha !== "undefined" && alpha >= 1.0)
			{
				this.context.globalAlpha = alpha;
				this.context.fillStyle = color;
				this.context.fillRect(x / this.scale.x, y / this.scale.y, w / this.scale.x, h / this.scale.y);
				this.context.globalAlpha = 1.0;
			} else {
				this.context.fillStyle = color;
				this.context.fillRect(x / this.scale.x, y / this.scale.y, w / this.scale.x, h / this.scale.y);
			}
		}
	} else {
		/*
		var colorLocation = this.context.getUniformLocation(this.program, "u_color");
		
		//Setup Rectangle
		var x1 = x;
		var x2 = x + w;
		var y1 = y;
		var y2 = y + h;
		this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
			x1, y1,
			x2, y1,
			x1, y2,
			x1, y2,
			x2, y1,
			x2, y2]), this.context.STATIC_DRAW);
		}
		//Set the color
		this.context.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

		//Draw the rectangle
		this.context.drawArrays(this.context.TRIANGLES, 0, 6);*/
	}
};

Display.prototype.drawImage = function(img, srcX, srcY, srcW, srcH, posX, posY, w, h, alpha, angle) {
	if(!this.webglenabled) {
		if(angle !== null && angle !== "undefined" && typeof angle === "number")
		{
			this.context.save();
			this.context.translate((posX + (w/2)) / this.scale.x, (posY + (h/2)) / this.scale.y);
			this.context.rotate(angle * Math.TO_RADIANS);
			if(alpha !== null && alpha !== "undefined" && alpha >= 1.0)
			{
				this.context.globalAlpha = alpha;
				this.context.drawImage(img, srcX, srcY, srcW, srcH, -((w/2) / this.scale.x), -((h/2) / this.scale.y), w / this.scale.x, h / this.scale.y);
				this.context.globalAlpha = 1.0;
			} else {
				this.context.drawImage(img, srcX, srcY, srcW, srcH, -((w/2) / this.scale.x), -((h/2) / this.scale.y), w / this.scale.x, h / this.scale.y);
			}
			this.context.restore();
			
		} else {
			if(alpha !== null && alpha !== "undefined" && alpha >= 1.0)
			{
				this.context.globalAlpha = alpha;
				this.context.drawImage(img, srcX, srcY, srcW, srcH, posX / this.scale.x, posY / this.scale.y, w / this.scale.x, h / this.scale.y);
				this.context.globalAlpha = 1.0;
			} else {
				this.context.drawImage(img, srcX, srcY, srcW, srcH, posX / this.scale.x, posY / this.scale.y, w / this.scale.x, h / this.scale.y);
			}
		}
		
	}
};

Display.prototype.getTextWidth = function(text)
{
	return this.context.measureText(text).width * this.scale.x;
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

Display.prototype.requestFullScreen = function() {
	if(this.canvas.requestFullScreen)
		this.canvas.requestFullScreen();
	else if(this.canvas.webkitRequestFullScreen)
		this.canvas.webkitRequestFullScreen();
	else if(this.canvas.mozRequestFullScreen)
		this.canvas.mozRequestFullScreen();
	else if(this.canvas.msRequestFullScreen)
		this.canvas.msRequestFullScreen();
	else if(this.canvas.oRequestFullScreen)
		this.canvas.oRequestFullScreen(); 
};