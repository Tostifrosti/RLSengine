function Timer(seconds) {
	this.startTime = Date.now();
	this.huidigeTijd = 0;
	this.eindTijd = seconds;
	this.finished = false;
}

Timer.prototype.update = function() {
	var d = Date.now();
	var deltaTime = (( d - this.startTime ) / 1000);
	this.startTime = Date.now();
	this.huidigeTijd += deltaTime;
	
	if(this.huidigeTijd > this.eindTijd) {
		this.finished = true;
	}
};


Timer.prototype.isFinished = function() {
	return this.finished;
};
Timer.prototype.reset = function() {
	this.startTime = Date.now();
	this.huidigeTijd = 0;
	this.finished = false;
};