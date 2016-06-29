/* 
	@author RLSmedia, Rick Smeets
*/
var requestAnimFrame = (function(callback){
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
	arguments.callee.DevMode = true;
	
	RLSengine.load();
}

RLSengine.load = function() {

	var mods = ['js/engine/Globals.js', 'js/engine/Utils/Array.js', 'js/engine/Utils/Point.js', 'js/engine/Utils/Math.js', 'js/engine/Utils/Device.js', 'js/engine/Utils/Timer.js', 
				'js/engine/Display.js', 'js/engine/Input/Mouse.js', 'js/engine/Input/Keyboard.js', 'js/engine/Location.js',
				'js/engine/Particle.js', 'js/engine/Emitter.js', 'js/engine/Effect.js', 'js/engine/EffectSequence.js', 'js/engine/XMLreader.js',
				'js/engine/Images.js', 'js/engine/ImageManager.js', 'js/engine/Audio/Song.js', 'js/engine/Audio/Audioplayer.js', 'js/engine/Animation.js',
				'js/engine/Facebook.js', 'js/GameScreen.js', 'js/MenuScreen.js', 'js/Game.js'];
	var count = mods.length;
	for(var i=0; i < mods.length; i++) {
		RLSengine.loadModule(mods[i], function() { 
			count--; 
			if(count <= 0)
				RLSengine.start();
		}, function(mod) {
			if(RLSengine.DevMode) console.error("Error: " + mod + ", couldn't load!");
		});
	}
	
}

RLSengine.start = function() {
	try {
		RLSengine._canvas = document.querySelector('canvas') || document.createElement('canvas');
		RLSengine.Display = new Display(RLSengine._canvas, RLSengine._ctx, 1280, 720);
		document.body.appendChild(RLSengine._canvas);
	} catch(e) {
		console.error('Error: Canvas not found! Please upgrade your browser to support HTML5!');
		if(RLSengine.DevMode) console.error(e);
		return;
	}

	RLSengine.Loading = [ XMLreader, ImageManager, AudioPlayer ];
	RLSengine.Loading.MaxLength = RLSengine.Loading.length;
	RLSengine.Loading.Finished = false;

	//Device
	try {
		RLSengine.Device = new Device();	
	} catch(e) {
		console.error("Error while loading: Device.js\n" + e);
		RLSengine.Device = null;
	}
	
	//Keyboard
	try {
		RLSengine.Keyboard = new Keyboard(RLSengine._canvas);
	} catch(e) {
		console.error("Error while loading: Keyboard.js\n" + e);
		RLSengine.Keyboard = null;
	}

	//Mouse
	try {
		RLSengine.Mouse = new Mouse(RLSengine._canvas, RLSengine.Display.scale);
	} catch(e) {
		console.error("Error while loading: Mouse.js\n" + e);
		RLSengine.Mouse = null;
	}
	
	//XMLreader
	try {
		RLSengine.XMLreader = new XMLreader();
		RLSengine.XMLreader.load(XML, function(results) {
			RLSengine.Loading.splice(0, 1);
			if(RLSengine.DevMode) console.info("All xml loaded!");
		});
	} catch(e) {
		console.error("Error while loading: XMLreader.js\n" + e);
		RLSengine.XMLreader = null;
	}
	

	//ImageManager
	try {
		RLSengine.ImageManager = new ImageManager();
		RLSengine.ImageManager.load(IMAGES, function() {
			RLSengine.Loading.splice(0, 1);
			if(RLSengine.DevMode) console.info("All images loaded!");
		});
	} catch(e) {
		console.error("Error while loading: ImageManager.js\n" + e);
		RLSengine.ImageManager = null;
	}

	//AudioPlayer
	try {
		RLSengine.AudioPlayer = new AudioPlayer();
		RLSengine.AudioPlayer.load(AUDIO, (RLSengine.Device.isiOS && !RLSengine.Device.isStandAlone), function() {
			RLSengine.Loading.splice(0, 1);
			if(RLSengine.DevMode) console.info("All audio loaded!");
		});
	} catch(e) {
		console.error("Error while loading: AudioPlayer.js\n" + e);
		RLSengine.AudioPlayer = null;
	}

	//Location
	try {
		RLSengine.Location = new Location({enableHighAccuracy: false, timeout: 30000, maximumAge: 30000});
	} catch(e) {
		console.error("Error while loading: Location.js\n" + e);
		RLSengine.Location = null;
	}
	

	//Request Fullscreen
	//RLSengine.Display.canvas.addEventListener("touchstart", function() { RLSengine.Display.requestFullScreen(); }, false);

	//Resize
	RLSengine.Display.resize();

	//Loop
	RLSengine.loop();
}

RLSengine.loop = function() {
	if(RLSengine === null) return;
	//Loading Screen
	if(!RLSengine.Loading.Finished) {
		if(RLSengine.Loading.length <= 0) {
			RLSengine.Loading.Finished = true;
			if(RLSengine.DevMode) console.info("Loading Finished!");
			RLSengine.Display.setScreen(new Game());
		}
		RLSengine.Display.context.clearRect(0, 0, RLSengine._canvas.width, RLSengine._canvas.height);
		//RLSengine.Display.fillRect(0, 0, RLSengine.Display.canvas.getWidth(), RLSengine.Display.canvas.getHeight(), "#000");
		//RLSengine.Display.drawText(RLSengine.Display.canvas.getWidth()/2 - 75, RLSengine.Display.canvas.getHeight()/2 - 20, "RLSmedia", "#FFF", 40, "Calibri");
		//RLSengine.Display.fillRect(RLSengine.Display.canvas.getWidth()/2 - 300, RLSengine.Display.canvas.getHeight()/2, 600, 2, "#FFF");
		//RLSengine.Display.fillRect(RLSengine.Display.canvas.getWidth()/2 + 300, RLSengine.Display.canvas.getHeight()/2, -((600/RLSengine.Loading.MaxLength) * RLSengine.Loading.length), 2, "#555");
		var radius = 150;
		var percentage = ((100/RLSengine.Loading.MaxLength) * RLSengine.Loading.length);
		var degrees = percentage * 360.0;
		var radians = degrees * (Math.PI / 180);
		var scale = (RLSengine.Display.scale.x >= RLSengine.Display.scale.y) ? RLSengine.Display.scale.x : RLSengine.Display.scale.y;
		RLSengine.Display.drawText((RLSengine.Display.canvas.getWidth()/2), (RLSengine.Display.canvas.getHeight()/2) - 200, "RLSmedia", "#FFF", 40, "Calibri");
		
		RLSengine.Display.context.translate(RLSengine.Display.canvas.width/2, RLSengine.Display.canvas.height/2); // center
		RLSengine.Display.context.rotate(-90 * Math.PI / 180);
		RLSengine.Display.drawArc(0, 0, radius, 2.0 * Math.PI, 0, true, "#555", 25 / scale, "square");
		RLSengine.Display.drawArc(0, 0, radius, 2.0 * Math.PI, radians / 100, true, "#FFF", 25 / scale, "round");
		RLSengine.Display.context.setTransform(1, 0, 0, 1, 0, 0); // reset current transformation matrix to the identity matrix
		
		var p = (100 - parseInt(percentage));
		RLSengine.Display.drawText((RLSengine.Display.canvas.getWidth()/2), (RLSengine.Display.canvas.getHeight()/2), p + "%", "#FFF", 40, "Calibri");
	} else {
		//Update & Draw
		if(typeof(RLSengine.Display) !== "undefined" && RLSengine.Display !== null) {
			RLSengine.Display.update();
			RLSengine.Display.draw();
		}
	}

	//FPS
	if(RLSengine.DevMode) {
		RLSengine.Display.drawText(30, 40, fps.getFPS(), "#FF0000", 20, "Calibri");
	}

	requestAnimFrame(RLSengine.loop);
}

RLSengine.stop = function(dispose) {
	if(typeof dispose !== 'boolean') return;
	if(RLSengine.Loading !== null)
		RLSengine.Loading = null;
	if(RLSengine.Device !== null) 
		RLSengine.Device = null;
	if(RLSengine.Keyboard !== null) {
		Keyboard.remove();
		RLSengine.Keyboard = null;
	}
	if(RLSengine.Mouse !== null) {
		RLSengine.Mouse.remove();
		RLSengine.Mouse = null;
	}
	if(RLSengine.XMLreader !== null) 
		RLSengine.XMLreader = null;
	if(RLSengine.ImageManager !== null) 
		RLSengine.ImageManager = null;
	if(RLSengine.AudioPlayer !== null)  {
		RLSengine.AudioPlayer.stopAll();
		RLSengine.AudioPlayer = null;
	}
	if(RLSengine.Location !== null) 
		RLSengine.Location = null;
	if(RLSengine.Display !== null) {
		RLSengine.Display.clearScreen();
		RLSengine.Display.stop();
		RLSengine.Display = null;
	}
	RLSengine.loop = function() {};
	cancelAnimationFrame(requestAnimFrame);
	
	
	console.clear();
	if(dispose) RLSengine.dispose();
	//RLSengine = null;
}
RLSengine.dispose = function()
{
	document.body.removeChild(RLSengine._canvas);
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
RLSengine.loadModule = function(mod, callback, error) {
	callback = callback || {};
	error = error || {};
	var element = document.createElement('script');
	element.setAttribute('type', 'text/javascript');
	element.setAttribute('src', mod);
	//element.addEventListener('load', callback, false);
	element.onload = function() {
		callback();
	};
	element.onerror = function() {
		error(mod);
	};
	var head = document.querySelector('head') || document.getElementsByTagName('head')[0];
	head.appendChild(element);
}

window.onload = RLSengine;