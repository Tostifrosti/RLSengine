/* 
	@author RLSmedia, Rick Smeets
*/

function Song(audio_ctx, buffer, name, url, duration)
{
	this.audio_ctx = audio_ctx || null;
	this.buffer = buffer;
	this.gainNode = null;

	this.name = name;
	this.url = url;
	this.start = 0.0;
	this.position = 0.0;
	this.duration = buffer.duration || 0.0;
	this.volume = 1.0;
	this.loop = false;
	this.isPlaying = false;
}

Song.prototype.play = function(start, volume, loop) {
	//console.log("Playing: " + this.name);
	var song = this;
	if(this.audio_ctx !== null) {
		//Web Audio API

		//Buffer
		var src = this.audio_ctx.createBufferSource();
		src.buffer = this.buffer.buffer; //Audiobuffer

		//Gainnode
		this.gainNode = this.audio_ctx.createGain();
		src.connect(this.gainNode);

		this.gainNode.connect(this.audio_ctx.destination);
		this.gainNode.gain.value = volume;

		src.currentTime = start; //Start
		src.loop = loop; //Loop

		src.onended = function() {
			song.isPlaying = false;
		};

		//Play
		if (!src.start)
			src.start = src.noteOn;	//<!-- (Prefix) Safari 6 (oud / deprecated)
		src.start(0);
		/*
		void start (optional double when = 0,
					optional double offset = 0,
					optional double duration);
		*/
		this.buffer = src;
	} else {
		//HTML5

		this.buffer.volume = volume;
		this.buffer.currentTime = start;
		this.buffer.loop = song.loop;

		this.buffer.onended = function() {
			song.isPlaying = false;
		};

		//Play
		this.buffer.play();
	}
	this.isPlaying = true;
};
Song.prototype.stop = function() {
	//console.log("Stopping: " + this.name);
	var song = this;
	if(this.audio_ctx !== null) {
		if (!this.buffer.stop)
			this.buffer.stop = this.buffer.noteOff;
		this.buffer.stop(0); //0 = seconds delay before stopping
		/* void stop (optional double when = 0); */
	} else {
		this.buffer.pause();
		this.buffer.currentTime = 0;
	}
	this.isPlaying = false;
};
Song.prototype.pause = function() {
	//console.log("Pausing: " + this.name);
	var song = this;
	if(this.audio_ctx !== null) {
		this.position = this.buffer.currentTime;
		if (!this.buffer.stop)
			this.buffer.stop = this.buffer.noteOff;
		this.buffer.stop(0); //0 = seconds delay before stopping
		this.isPlaying = false;
	} else {
		if (this.buffer.paused && this.buffer.currentTime > 0 && !this.buffer.ended)
		{
			//Not playing...maybe paused, stoped or never played.
		} else {
			//Pausing..
			this.buffer.pause();
			this.isPlaying = false;
		}
	}
};
Song.prototype.resume = function() {
	//console.log("Resuming: " + this.name);
	this.isPlaying = true;
	var song = this;

	if(this.audio_ctx !== null)
	{
		if (!this.buffer.start) 
				this.buffer.start = this.buffer.noteOn;
			this.buffer.start(0, this.position, (this.buffer.duration - this.position));
			this.isPlaying = true;
	} else {
		this.buffer.currentTime = this.position;
		this.buffer.play();
		song.isPlaying = true;
	}
};

Song.prototype.setVolume = function(value) {
	//console.log(this.name + " volume: " + value);
	if(this.audio_ctx !== null)
	{
		if(this.gainNode !== null)
			this.gainNode.gain.value = value;
	} else {
		this.buffer.volume = value;
	}
};