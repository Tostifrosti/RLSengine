/* 
	@author RLSmedia, Rick Smeets
*/

function Display(canvas, context, width, height) {
	this.canvas = canvas;
	this.context = context;
	this.canvas.width = width || 1280;
	this.canvas.height = height || 720;
	this._screen = null;
	this.screen = {};
	this.screen.width = 0;
	this.screen.height = 0;
	
	this.webglenabled = false;
	this._init();
}

Display.prototype._init = function() {
	this.screen.width = window.innerWidth;
	this.screen.height = window.innerHeight;

	window.addEventListener('resize', this.resize, false);
	window.addEventListener('orientationchange', this.resize, false);

	window.addEventListener('focus', this.focus, false);
	
	this.initContext("2d", { alpha: false });
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

	if(typeof(this._screen) !== "undefined" && this._screen !== null)
		this._screen.draw();
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

Display.prototype.clearRect = function(x, y, width, height) {
	if(!this.webglenabled) {
		this.context.clearRect(x, y, width, height);
	}
};

Display.prototype.drawText = function(x, y, text, color, font) {
	if(!this.webglenabled) {
		this.context.font = font;
		this.context.fillStyle = color;
		this.context.fillText(text, x, y);
	}
};
Display.prototype.fillRect = function(x, y, w, h, color) {
	if(!this.webglenabled) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, w, h);
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

Display.prototype.drawImage = function(img, srcX, srcY, srcW, srcH, posX, posY, w, h) {
	if(!this.webglenabled) {
		this.context.drawImage(img, srcX, srcY, srcW, srcH, posX, posY, w, h);
	}
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