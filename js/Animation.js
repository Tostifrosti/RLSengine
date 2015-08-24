/* 
	@author RLSmedia, Rick Smeets
*/

function Animation(spritesheet, width, height, sequence, type) {
	this.spritesheet = spritesheet;
	this.width = width;
	this.height = height;
	this.sequence = sequence || [0];
	this.type = type || 0; //Loop, PingPing, HoldLast, HoldFirst, Once

	this.frame = 0;
	this.frameIndex = 0;
	this.xOffset = 0;
	this.yOffset = 0;

	this.lastUpdateTime = Date.now();
	this.delta = 0;
	this.acDelta = 0;

	this.finished = false;
}

Animation.prototype.update = function(fps) {
	fps = fps || 10;
	var mspf = (1.0 / fps) * 1000;

	this.delta = (Date.now() - this.lastUpdateTime);
	this.acDelta += this.delta;

	switch(this.type) {
		case 0: //Loop
			var time = this.acDelta % (this.sequence.length * mspf);
			this.frameIndex = Math.floor(time / mspf);
			this.finished = false;
			break;
		case 1: //PingPong
			var time = this.getPingPong(this.acDelta, (this.sequence.length * mspf));
			this.frameIndex = Math.floor(time / mspf);
			break;
		case 2: //HoldLast
			this.acDelta %= (this.sequence.length * mspf);
			if(this.frameIndex < (this.sequence.length-1) && !this.finished) {
				this.frameIndex = Math.floor(this.acDelta / mspf);
			} else {
				this.finished = true;
				this.frameIndex = (this.sequence.length-1);
			}
			break;
		case 3: //HoldFirst
			this.acDelta %= (this.sequence.length * mspf);
			if(this.frameIndex < (this.sequence.length-1) && !this.finished) {
				this.finished = false;
				this.frameIndex = Math.floor(this.acDelta / mspf);
			} else {
				this.frameIndex = 0;
				this.finished = true;
			}
			break;
		case 4: //Once
			this.acDelta %= (this.sequence.length * mspf);
			if(this.frameIndex < (this.sequence.length-1) && !this.finished) {
				this.finished = false;
				this.frameIndex = Math.floor(this.acDelta / mspf);
			} else {
				this.finished = true;
				this.frameIndex = -1;
			}
			break;
	}



	this.frame = this.sequence[this.frameIndex];
	
	var numColumns = Math.floor(this.spritesheet.width / this.width);
	
	var row = Math.floor(this.frame / numColumns);
	var column = (this.frame % numColumns);
	
	this.xOffset = (column * this.width);
	this.yOffset = (row * this.height);

	this.lastUpdateTime = Date.now();
};


Animation.prototype.draw = function(posX, posY) {
	posX = posX || 0;
	posY = posY || 0;
	//img, srcX, srcY, srcW, srcH, posX, posY, w, h
	RLSengine.Display.drawImage(this.spritesheet, this.xOffset, this.yOffset, this.width, this.height, posX, posY, this.width, this.height);
};
Animation.prototype.getPingPong = function(tijd, length) {
	var t = (tijd % (length * 2.0) );
	return (length - Math.abs(t - length));
};


Animation.prototype.reset = function() {
	this.finished = false;
	this.acDelta = 0;
	this.frameIndex = 0;
	this.lastUpdateTime = Date.now();
};

Animation.prototype.isFinished = function() {
	return this.finished;
};