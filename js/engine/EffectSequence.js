/* 
	@author RLSmedia, Rick Smeets
*/

function EffectSequence() {
	this.effects = [];
	this.startValue = 0;
	this.finished = false;
	for(var i=0; i < arguments.length; i++) {
		this.effects.push(arguments[i]);
	}
}

EffectSequence.prototype.update = function() {
	this.effects[this.startValue].update();
	if(this.effects[this.startValue].isFinished()) {
		if(this.startValue < (this.effects.length-1) ) {
			this.startValue++;
			this.effects[this.startValue].init();
		} else {
			this.finished = true;
		}
	}
};

EffectSequence.prototype.isFinished = function() {
	return this.finished;
};
EffectSequence.prototype.init = function() {
	this.finished = false;
	this.startValue = 0;
	for(var i=0; i<this.effects.length; i++) {
		this.effects[i].init();
	}
};