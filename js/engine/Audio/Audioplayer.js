/*
	@author RLSmedia, Rick Smeets

1. Create audio context
2. Inside the context, create sources - such as <audio>, oscillator, stream
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
AudioPlayer.prototype.load = function(sounds, isIOS, callback) {
	this._sounds = sounds || {};
	this.isPlaying = [];
	this.songs = [];
	this.isIOS = isIOS || false;
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

/* Loading */
AudioPlayer.prototype._loadHTML5 = function() {
	if(this._devMode) console.log("Loading audio in HTML5..");
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
		audiobuffer.addEventListener('ended', function() {
			audiobuffer.isPlaying = false;
			self.isPlaying.splice(self.isPlaying.indexOf(name), 1);
		});

		
		document.body.appendChild(audiobuffer);
		audiobuffer.pause(); //Fix for IE
		
		audiobuffer.oncanplaythrough = function() {
			this.setAttribute("loaded", true);

			//audio_ctx, buffer, name, url, duration
			self.songs.push(new Song(self._audio_ctx, this, name, url, this.duration));
			if(self._devMode) console.log("Sound: " + name + ", loaded! (" + url + ")");
			if(++currentSound >= totalSounds) {
				if(self._devMode) console.log("All sounds are loaded!");
				all_musicLoaded = true;
				self._callback(self.songs);
			}
		};
	}
};
AudioPlayer.prototype._loadContext = function() {
	if(this._devMode) console.log("Loading audio in AudioContext..");
	var currentSound = 0;
	var totalSounds = 0;
	var all_musicLoaded = false;
	var curAudioFormat = null;

	for(var name in this._sounds) {
		totalSounds++;
	}
	if(this._devMode) console.log("Aantal sounds: " + totalSounds);

	function loadMusic(url, context, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true); //true = asynchronously
		request.responseType = 'arraybuffer';
		request.onload = function() {
			context.decodeAudioData(request.response, callback, function(e) {
				console.error("Decoding error: The stream provided is corrupt or unsupported!");
			});
		}
		request.onerror = function() {
			console.error("Error on: " + url);
		}
		request.send();
	}

	var loadAudioData = function(name, context, url) {
		loadMusic(url, context, function(buffer) 
		{
			var source = self._audio_ctx.createBufferSource();
			source.buffer = buffer;
									//audio_ctx, buffer, name, url, duration
			self.songs.push(new Song(self._audio_ctx, source, name, url, source.buffer.duration));
			if(self._devMode) console.log("Sound: "+name+", loaded! (" + url +")");
			if(++currentSound >= totalSounds) 
			{
				if(self.isIOS) {
					window.addEventListener('touchend', testIOS);
				}
				if(self._devMode) console.log("All sound are loaded!");
				all_musicLoaded = true;
				self._callback(this.songs);
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

	var song = this.checkSong(name);
	if(song === null) { throw "AudioPlayer.play(name, options): Givin name of song is not preloaded!"; }

	if(typeof options.start === 'undefined' || (options.start < 0.00 || options.start >= song.duration)) { 
		options.start = 0.00;
	}
	if(typeof options.volume === 'undefined' || (options.volume < 0.00 || options.volume > 1.00)) { 
		options.volume = 1.00;
	}
	options.volume = (options.volume * this._masterVolume);
	if(typeof options.loop !== 'boolean') { 
		options.loop = false;
	}
	//Play!
	song.play(options.start, options.volume, options.loop);
	this.isPlaying.push(song.name);
};


AudioPlayer.prototype.checkDeviceIsOld = function() {
	if(typeof(this._audio_ctx.createGain) === 'undefined')
		return true;
	else
		return false;
};

AudioPlayer.prototype.pause = function(name) {
	var song = this.checkSong(name);
	if(song === null) { throw "AudioPlayer.pause(name): name is not valid!"; }
	song.pause();
};
AudioPlayer.prototype.stop = function(name) {
	var song = this.checkSong(name);
	if(song === null) { throw "AudioPlayer.stop(name): name is not valid!"; }
	song.stop();
	this.isPlaying.splice(song.name, 1);
};
AudioPlayer.prototype.stopAll = function() {
	for(var i=0; i<this.isPlaying.length; i++)
	{
		this.stop(this.isPlaying[i]);
	}
};
AudioPlayer.prototype.getMute = function() {
	return this._muted;
};
AudioPlayer.prototype.setMute = function(value) {
	if(typeof value !== "boolean") { throw "AudioPlayer.setMute(value): value must be a boolean!"; }
	if(this._devMode) console.log("Muting: " + value);
	this._muted = value || false;
	for(var i=0; i<this.isPlaying.length; i++)
	{
		if(this._muted) {
			this.setMasterVolume(0.00);
		} else {
			this.setMasterVolume(1.00);
		}
	}
};

AudioPlayer.prototype.setVolume = function(name, value) {
	var song = this.checkSong(name);
	if(song === null) { throw "AudioPlayer.setVolume(name, value): name is not valid!"; }

	if(value < 0.00) value = 0; 
	else if(value > 1.00) value = 1.00;
	
	song.setVolume((value * this._masterVolume));
};
/*AudioPlayer.prototype.getVolume = function() {
	return this._masterVolume;
};*/

AudioPlayer.prototype.setMasterVolume = function(value) {
	if(typeof value !== "number") { throw "AudioPlayer.setMasterVolume(value): value must be a Integer or Float!"; }
	if(value < 0.00) value = 0; 
	else if(value > 1.00) value = 1.00;

	this._masterVolume = value;
	for(var i=0; i<this.isPlaying.length; i++)
	{
		this.setVolume(this.isPlaying[i], this._masterVolume);
	}
};

AudioPlayer.prototype.checkSong = function(name) {
	var song = null;
	if(typeof this.songs === "undefined") return null;

	for(var i=0; i<this.songs.length; i++) {
		if(this.songs[i].name === name) {
			song = this.songs[i];
		}
	}
	return song;
};


//Test for iOS else it doesnt work...
function testIOS(event) {
	if(RLSengine.AudioPlayer === null || RLSengine.AudioPlayer === "undefined") return;
	console.log("Breaking IOS music wall...");
	var song = RLSengine.AudioPlayer.songs[0];
	var audio_ctx = RLSengine.AudioPlayer._audio_ctx;
	
	var src = audio_ctx.createBufferSource();
	src.buffer = song.buffer.buffer;

	var gainNode = audio_ctx.createGain();
	src.connect(gainNode);

	gainNode.connect(audio_ctx.destination);
	gainNode.gain.value = 0.0;

	src.currentTime = 0.0; //Start
	src.loop = false; //Loop

	if (!src.start)
		src.start = src.noteOn;	//<!-- (Prefix) Safari 6 (oud / deprecated)
	src.start(0);

	src.stop(0.5);
	window.removeEventListener('touchend', testIOS); //bubbling = false (inner -> outer), capturing = true (outer -> inner)
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