function Timer(seconds) {
	this.startTime = Date.now();
	this.currentTime = 0;
	this.endTime = seconds;
	this.finished = false;
}

Timer.prototype.update = function() {
	var d = Date.now();
	var deltaTime = (( d - this.startTime ) / 1000);
	this.startTime = Date.now();
	this.currentTime += deltaTime;
	
	if(this.currentTime > this.endTime) {
		this.finished = true;
	}
};


Timer.prototype.isFinished = function() {
	return this.finished;
};
Timer.prototype.reset = function() {
	this.startTime = Date.now();
	this.currentTime = 0;
	this.finished = false;
};