/* 
	@author RLSmedia, Rick Smeets
*/
var requestAnimFrame = (function(){
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
})();
var cancelAnimFrame = (function(){
	return window.cancelAnimationFrame || 
		window.webkitCancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.msCancelAnimationFrame ||
		window.oCancelAnimationFrame ||
		function(callback, element){
			window.clearTimeout(callback);
		};
})();


var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = Date.now(); //new Date().getTime(),
		var currentTime = (( d - this.startTime ) / 1000),
		result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = Date.now(); //new Date().getTime();
			this.frameNumber = 0;
		}
		return result;
	}
};

function RLSengine() {
	arguments.callee._canvas = null;
	arguments.callee._ctx = null;

	RLSengine.init();
}

RLSengine.init = function() {
	RLSengine.DevMode = false;

	try {
		RLSengine._canvas = document.querySelector('canvas') || document.createElement('canvas');
		RLSengine.Display = new Display(RLSengine._canvas, RLSengine._ctx, 1280, 720);
		document.body.appendChild(RLSengine._canvas);
	} catch(e) {
		console.error('Error: Canvas not found! Please upgrade your browser to support HTML5!');
		return;
	}

	RLSengine.Loading = [ XMLreader, ImageManager, AudioPlayer ];
	RLSengine.Loading.MaxLength = RLSengine.Loading.length;
	RLSengine.Loading.Finished = false;

	//Device
	RLSengine.Device = new Device();

	//Math
	RLSengine.Math = new Maths();

	//Keyboard
	RLSengine.Keyboard = new Keyboard(RLSengine._canvas);

	//Mouse
	RLSengine.Mouse = new Mouse(RLSengine._canvas);
	
	//XMLreader
	RLSengine.XMLreader = new XMLreader();
	RLSengine.XMLreader.load(XML, function(results) {
		RLSengine.Loading.splice(0, 1);
		if(RLSengine.DevMode) console.info("All xml loaded!");
	});

	//ImageManager
	RLSengine.ImageManager = new ImageManager();
	RLSengine.ImageManager.load(IMAGES, function() {
		RLSengine.Loading.splice(0, 1);
		if(RLSengine.DevMode) console.info("All images loaded!");
	});

	//AudioPlayer
	RLSengine.AudioPlayer = new AudioPlayer();
	RLSengine.AudioPlayer.load(AUDIO, function() {
		RLSengine.Loading.splice(0, 1);
		if(RLSengine.DevMode) console.info("All audio loaded!");
	});

	//AnimationManager
	RLSengine.AnimationManager = new AnimationManager();
	//RLSengine.AnimationManager.load();

	//Loop
	RLSengine.loop();
}

RLSengine.loop = function() {
	//Loading Screen
	if(!RLSengine.Loading.Finished) {
		if(RLSengine.Loading.length <= 0) {
			RLSengine.Loading.Finished = true;
			RLSengine.Display.setScreen(new Game());
		}
		RLSengine.Display.drawText(RLSengine.Display.canvas.width/2 - 75, RLSengine.Display.canvas.height/2 - 20, "RLSmedia", "#FFF", "40px Calibri");
		RLSengine.Display.fillRect(RLSengine.Display.canvas.width/2 - 300, RLSengine.Display.canvas.height/2, 600, 2, "#555");
		RLSengine.Display.fillRect(RLSengine.Display.canvas.width/2 - 300, RLSengine.Display.canvas.height/2, (100/RLSengine.Loading.length) * RLSengine.Loading.MaxLength, 2, "#FFF");
	}

	//Update & Draw
	if(typeof(RLSengine.Display) !== "undefined" && RLSengine.Display !== null) {
		RLSengine.Display.update();
		RLSengine.Display.draw();
	}

	//FPS
	if(RLSengine.DevMode) {
		RLSengine.Display.drawText(30, 40, fps.getFPS(), "#FF0000", "20px Calibri");
	}

	requestAnimFrame(RLSengine.loop);
}

RLSengine.stop = function() {
	RLSengine.Mouse.remove();
	RLSengine.Keyboard.remove();
	cancelAnimationFrame();
}

RLSengine.pause = function(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
}

//Zet dit onder elke subklasse: extend(raceauto, car);
/*function extend(subConstructor, superConstructor) {
	subConstructor.prototype = Object.create(superConstructor.prototype, {
		constructor: {
			value: subConstructor,
			enumerable: false,
			writeable: true,
			configurable: true
		}
	});

}*/



window.onload = RLSengine;