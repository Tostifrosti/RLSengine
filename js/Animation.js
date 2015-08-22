function Animation(animation, type) {
	this.animation = animation;
	this.type = type; //Loop, PingPing, HoldLast, HoldFirst, Once

	this.image;
	this.sequence;
	this.width;
	this.height;
	this.fps;
	this.frame;
	this.finished;
	this.xOffset;
	this.yOffset;
	this.msPerFrame;
	this.acDelta;
}

Animation.prototype.update = function() {
	
};
Animation.prototype.draw = function() {
	
};