/*
	@author RLSmedia, Rick Smeets

1. Create audio context
2. Inside the context, create sources — such as <audio>, oscillator, stream
3. Create effects nodes, such as reverb, biquad filter, panner, compressor
4. Choose final destination of audio, for example your system speakers
5. Connect the sources up to the effects, and the effects to the destination.

*/


/* Sounds in Safari moeten langer dan 1 sec!! Anders crash; */
var self = null;

function AudioPlayer() {
	this._devMode = false;
	self = this;
}
AudioPlayer.prototype.load = function(sounds, callback) {
	this._sounds = sounds || {};
	this._allSounds = {};
	this._callback = callback || function(){};

	this._audioType = null;
	this._audioFormat = null;

	this._muted = false;
	this._masterVolume = 1.00;

	this._audio_ctx = null;
	this._init();
}

AudioPlayer.prototype._init = function() {
	if(this._devMode) console.log("Starting AudioPlayer..");
	this._checkAudioFormat();
	
	for(var sound in this._sounds) {
		var type = null;
		for(var i=0; i<this._sounds[sound].length; i++) {
			if(this._devMode) console.log("Checking support for " + this._sounds[sound][i] + "("+i+")");
			type = this._sounds[sound][i].substring(this._sounds[sound][i].lastIndexOf("."), this._sounds[sound][i].length);
			var support = this.checkSupport(type);
			if(support < 0) {
				if(this._devMode) console.error("No support detected for " +type + "("+i+")"+"! Deleting: " + this._sounds[sound][i]);
				this._sounds[sound].splice(i, 1);
				i--;
			} else {
				this._sounds[sound].format = this._audioFormat[support];
			}
		}
		if(typeof this._sounds[sound][0] !== "undefined" && this._sounds[sound][0] !== null) {
			this._sounds[sound][0] = this._sounds[sound][0];
		} else {
			if(RLSengine.DevMode || this._devMode) console.error("Error: '" + sound + "' audio is not supported in this browser!");
			delete this._sounds[sound];
		}
	}
	this._createAudioContext();
};
AudioPlayer.prototype._createAudioContext = function() {
	// Fix up prefixing
	window.AudioContext = (window.AudioContext || window.webkitAudioContext); // define audio context
	if (typeof window.AudioContext !== 'undefined') {
		this._audio_ctx = new window.AudioContext();
		if(this.checkDeviceIsOld()) {
			console.error("This device is too old to play audio via browser!");
			this._audio_ctx = null;	
			self = null;
			alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
			return;
		} else {
			this._loadContext();
		}
	} else {
		this._audio_ctx = null;
		this._loadHTML5();
	}
};

AudioPlayer.prototype._addSound = function(buffer, gainNode, name, url, start, duration, volume, loop) {
	if (typeof volume === 'undefined') { volume = 1; }
	if (typeof loop === 'undefined') { loop = false; }
	this._allSounds[name] = {
		buffer: buffer,
		gainNode: gainNode,
		name: name,
		url: url,
		start: start,
		duration: duration,
		volume: volume,
		loop: loop
	};
};

/* Loading */
AudioPlayer.prototype._loadHTML5 = function() {
	if(this._devMode) console.log("Loading audio in HTML5..");
	//var self = this;
	var currentSound = 0;
	var totalSounds = 0;
	var audiobuffer = null;
	var all_musicLoaded = false;

	for(var name in this._sounds) {
		totalSounds++;
	}
	if(this._devMode) console.log("Aantal sounds: " + totalSounds);

	for(var name in this._sounds) {
		var url = this._sounds[name][0];
		var format = this._sounds[name].format;
		audiobuffer = document.createElement('AUDIO');
		var src1_el = document.createElement('SOURCE');

		audiobuffer.setAttribute("id", name);
		src1_el.setAttribute("src", url);
		src1_el.setAttribute("type", format);
		src1_el.setAttribute("media", 'all');

		audiobuffer.setAttribute('preload', 'auto');
		audiobuffer.setAttribute('autoplay', false);

		audiobuffer.setAttribute("loaded", false);
		audiobuffer.appendChild(src1_el);
		
		document.body.appendChild(audiobuffer);
		audiobuffer.pause(); //Fix for IE
		
		audiobuffer.oncanplaythrough = function() {
			this.setAttribute("loaded", true);
			//buffer, name, url, start, duration, volume, loop
			self._addSound(this, null, name, url, 0, this.duration, 1.00, false);
			if(self._devMode) console.log("Sound: " + name + ", loaded! (" + url + ")");
			if(++currentSound >= totalSounds) {
				if(self._devMode) console.log("All sounds are loaded!");
				all_musicLoaded = true;
				self._callback(this._allSounds);
			}
		};
	}
};
AudioPlayer.prototype._loadContext = function() {
	if(this._devMode) console.log("Loading audio in AudioContext..");
	//var self = this;
	var currentSound = 0;
	var totalSounds = 0;
	var all_musicLoaded = false;
	var curAudioFormat = null;
	//this._gainNode = this._audio_ctx.createGain(); //createGainNode(); <-- oud/deprecated 
	//this._source = this._audio_ctx.createBufferSource();

	for(var name in this._sounds) {
		totalSounds++;
	}
	if(this._devMode) console.log("Aantal sounds: " + totalSounds);

	function loadMusic(url, context, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true); //true = asynchronously
		request.responseType = 'arraybuffer';
		request.onload = function() {
			context.decodeAudioData(request.response, callback);
			//context.decodeAudioData(request.response).then(callback); // unknown\too new?
		}
		request.onerror = function() {
			console.error("Error on: " + url);
		}
		request.send();
	}

	var loadAudioData = function(name, context, url) {
		loadMusic(url, context, function(buffer) { //Async
			var source = self._audio_ctx.createBufferSource();
			source.buffer = buffer;
			self._addSound(source, null, name, url, 0, 0, 1.0, false);
			if(self._devMode) console.log("Sound: "+name+", loaded! (" + url +")");
			if(++currentSound >= totalSounds) {
				document.addEventListener('touchstart', testIOS, true);
				document.addEventListener('ontouchstart', testIOS, true);
				if(self._devMode) console.log("All sound are loaded!");
				all_musicLoaded = true;
				self._callback(this._allSounds);
			}
		});
	};
	for(var name in this._sounds) {
		var url = this._sounds[name][0];
		loadAudioData(name, this._audio_ctx, url);
	}
};


/* Playing */
AudioPlayer.prototype.play = function(name, options) {
	options = options || {};
	if(this._muted) return;

	//this._currentSound = name;
	if(this._audio_ctx !== null) {
		this._playCtx(name, options);
	} else {
		this._playHTML5(name, options);
	}
};

/* Sound */
AudioPlayer.prototype._playCtx = function(name, options) {
	if(typeof this._allSounds[name] === 'undefined') return; //Unknown name

	if(this._devMode) console.log("Playing: " + name);

	//Get Buffer
	var src = this._audio_ctx.createBufferSource();
	src.buffer = this._allSounds[name].buffer.buffer; //Audiobuffer
	
	//Gainnode
	var gainNode = this._audio_ctx.createGain(); //this._gainNode
	src.connect(gainNode);

	gainNode.connect(this._audio_ctx.destination); 
	
	//Volume
	if(typeof options.volume !== 'undefined' && (options.volume >= 0.00 && options.volume <= 1.00)) { 
		this._allSounds[name].volume = options.volume;
	} else {
		this._allSounds[name].volume = 1.00;
	}
	gainNode.gain.value = (this._allSounds[name].volume * this._masterVolume);

	//Position : TODO, only works in HTML5!
	if(typeof(options.position) !== 'undefined') {
		if(options.position >= 0 && options.position <= src.buffer.duration) {
			src.currentTime = options.position;
		} else {
			if(this._devMode) console.error("Givin position of " + name + " is out of range! (Duration is "+src.buffer.duration+"s)");
		}
	} else {
		src.currentTime = 0;
	}
	
	//Loop
	if(typeof options.loop !== 'undefined') 
		this._allSounds[name].loop = options.loop;
	src.loop = this._allSounds[name].loop;
	
	//Play
	if (!src.start)
		src.start = src.noteOn;	//<!-- (Prefix) Safari 6 (oud / deprecated)

	//Offset, Position, Duration
	//src.start(0, src.currentTime, src.buffer.duration - src.currentTime);
	src.start(0);

	this._allSounds[name].buffer = src;
	this._allSounds[name].gainNode = gainNode;
};
AudioPlayer.prototype._playHTML5 = function(name, options) {
	if(typeof this._allSounds[name] === 'undefined') return; //Unknown name or not finished loading

	if(this._allSounds[name].buffer.getAttribute("loaded") === 'true') {
		if(this._devMode) console.log("Playing: " + name);
		var src = this._allSounds[name];
		
		//Volume
		if(typeof options.volume !== 'undefined' && (options.volume >= 0.00 && options.volume <= 1.00)) {
			src.volume = options.volume;	
		} else {
			src.volume = 1.00;
		}
		src.buffer.volume = (src.volume * this._masterVolume);

		//Position
		if(typeof options.position !== 'undefined'){
			if(options.position >= 0 && options.position <= src.buffer.duration) {
				src.buffer.currentTime = options.position;
			} else {
				if(this._devMode) console.error("Givin position of " + name + " is out of range! (Duration is "+src.buffer.duration+"s)");
			}
		}
		
		//Loop
		if(typeof options.loop !== 'undefined') 
			src.loop = options.loop;
		src.buffer.loop = src.loop;

		//Play
		src.buffer.play();
	}
};


AudioPlayer.prototype.checkDeviceIsOld = function() {
	if(typeof(this._audio_ctx.createGain) === 'undefined')
		return true;
	else
		return false;
};

AudioPlayer.prototype.pause = function(name) {
	if(typeof this._allSounds[name] === 'undefined') return; //Unknown name or not finished loading
	if(this._audio_ctx !== null) {
		if(this._devMode) console.log("Pausing: " + name);
		var src = this._allSounds[name].buffer;
		if (!src.stop)
			src.stop = src.noteOff;
		src.stop(0); //0 = seconds delay before stopping
	} else {
		if (this._allSounds[name].buffer.paused && this._allSounds[name].buffer.currentTime > 0 && !this._allSounds[name].buffer.ended) {
			//Not playing...maybe paused, stoped or never played.
			//console.log(name + ", is not playing!");
			//this.play(name);
		} else {
			//Pausing..
			if(this._devMode) console.log("Pausing: " + name);
			this._allSounds[name].buffer.pause();
		}
	}
};
AudioPlayer.prototype.stop = function(name) {
	if(typeof this._allSounds[name] === 'undefined') return; //Unknown name or not finished loading
	if(this._devMode) console.log("Stopping: " + name);
	if(this._audio_ctx !== null) {
		var src = this._allSounds[name].buffer;
		if (!src.stop)
			src.stop = src.noteOff;
		src.stop(0); //0 = seconds delay before stopping
	} else {
		this._allSounds[name].buffer.pause();
		this._allSounds[name].buffer.currentTime = 0;
	}
};

/*AudioPlayer.prototype.setMute = function(value) {
	this._muted = value;
	if(this._muted) {
		//TODO: stop all music/sounds
		//this.pause(this._currentSound);
	}
};*/

AudioPlayer.prototype.setVolume = function(name, value) {
	if(typeof(this._allSounds[name]) === 'undefined') return; //Unknown name or not finished loading
	
	if(value < 0) value = 0; 
	else if(value > 1.00) value = 1.00;
	
	this._masterVolume = value;
	
	if(this._devMode) console.log("Volume: " + (this._allSounds[name].volume * this._masterVolume));
	if(this._audio_ctx === null) {
		//HTML5
		this._allSounds[name].buffer.volume = (this._allSounds[name].volume * this._masterVolume);
	} else {
		//CTX
		this._allSounds[name].gainNode.gain.value = (this._allSounds[name].volume * this._masterVolume);
	}
};
AudioPlayer.prototype.getVolume = function() {
	return this._masterVolume;
};




//Test for iOS else it doesnt work...
function testIOS() {
	if(typeof self.play === 'function') {
		var name = null;
		for(var s in self._allSounds) {
			name = s; break;
		}
		document.removeEventListener('touchstart', testIOS, true);
		document.removeEventListener('ontouchstart', testIOS, true);
		self.play(name, { loop: false, volume: 0.0 });
	}
}

AudioPlayer.prototype.checkSupport = function(type) {
	for(var i=0; i<this._audioType.length; i++) {
		if(this._audioType[i] === type) {
			return i;
		}
	}
	return -1;
};

AudioPlayer.prototype._checkAudioFormat = function() {
	this._audioType = [];
	this._audioFormat = [];
	var support = false;
	//The best way is to use OGG + AAC

	if (document.createElement('audio').canPlayType('audio/ogg;codecs="vorbis"') === "probably" || document.createElement('audio').canPlayType('audio/ogg;codecs="vorbis"') === "maybe") {
		//Ogg is an open standard and royalty free 
		//Supported: Google Chrome(6.0), Firefox (3.5), Opera (10.5), Safari(3.1 + must be installed separatly), Opera Mobile(11.0), Opera Mini (Partial), Firefox Mobile(24.0),
		//Not Supported: IE, IE Mobile,  Safari Mobile
		//Unknown: Android, Chrome for Android
		this._audioType.push(".ogg");
		this._audioFormat.push("audio/ogg; codec='vorbis'");
		if(this._devMode) console.log("OGG support detected! ("+document.createElement('audio').canPlayType('audio/ogg;codecs="vorbis"')+")");
		support = true;
	}
	if(document.createElement('audio').canPlayType("audio/x-m4a;") === "probably" || document.createElement('audio').canPlayType("audio/x-m4a;") === "maybe") {
		//Supported: Google Chrome, Firefox, IE 11
		//Not Supported: Opera, Safari
		//Unknown: 
		this._audioType.push(".m4a");
		this._audioFormat.push("audio/x-m4a"); //MPEG-4
		if(this._devMode) console.log("x-m4a support detected! ("+document.createElement('audio').canPlayType("audio/x-m4a;")+")");
		support = true;
	} 
	if(document.createElement('audio').canPlayType('audio/aac;') === "probably" || document.createElement('audio').canPlayType('audio/aac;') === "maybe") {
		//Supported: Google Chrome, Firefox (Partial), IE (9.0), Opera, Safari (3.1), IE Mobile (10.0), Opera Mini (Partial), Safari Mobile
		//Not Supported: Firefox mobile (Partial)
		//Unknown: Android, Opera Mobile, Chrome for Android
		this._audioType.push(".m4a");
		this._audioFormat.push("audio/aac");
		if(this._devMode) console.log("AAC support detected! ("+document.createElement('audio').canPlayType('audio/aac;')+")");
		support = true;
	} 
	if(document.createElement('audio').canPlayType('audio/mp4;codecs="mp4a.40.5"') === "probably" || document.createElement('audio').canPlayType('audio/mp4;codecs="mp4a.40.5"') === "maybe") {
		this._audioType.push(".mp4");
		this._audioFormat.push("audio/mp4");
		if(this._devMode) console.log("MP4 support detected! ("+document.createElement('audio').canPlayType('audio/mp4;codecs="mp4a.40.5"')+")");
		support = true;
	} 
	if(document.createElement('audio').canPlayType('audio/mpeg') === "probably" || document.createElement('audio').canPlayType('audio/mpeg') === "maybe") {
		//You need licence for this to put online.
		//Supported: Google Chrome(6.0), Firefox (22.0/hardware depented), IE (9.0), Opera, Safari (3.1)
		this._audioType.push(".mp3");
		this._audioFormat.push("audio/mp3");
		if(this._devMode) console.log("MP3 support detected! ("+document.createElement('audio').canPlayType('audio/mpeg')+")");
		support = true;
	}
	if(document.createElement('audio').canPlayType('audio/wav') === "probably" || document.createElement('audio').canPlayType('audio/wav') === "maybe") {
		//Supported: Google Chrome, Firefox, Opera, Safari
		//Not Supported: IE
		this._audioType.push(".wav");
		this._audioFormat.push("audio/wav");
		if(this._devMode) console.log("WAV support detected! ("+document.createElement('audio').canPlayType('audio/wav')+")");
		support = true;
	} 
	if(document.createElement('audio').canPlayType('audio/webm; codecs="vorbis"') === "probably" || document.createElement('audio').canPlayType('audio/webm; codecs="vorbis"') === "maybe") {
		//Supported: Google Chrome, Firefox (4.0), Opera (10.60), Safari (3.1, must be installed separatly), Firefox Mobile (24.0), Opera Mobile (11.0), Opera Mini (Partial)
		//Not Supported: IE, Android(?), IE Mobile, Safari Mobile, Chrome for Android(?)
		this._audioType.push(".webm");
		this._audioFormat.push("audio/webm");
		if(this._devMode) console.log("WEBM support detected! ("+document.createElement('audio').canPlayType('audio/webm; codecs="vorbis"')+")");
		support = true;
	}
	if(!support){
		//No Audio Support!
		this._audioType = null;
		this._audioFormat = null;
		if(this._devMode) console.error("No audio support detected!");
	}
};