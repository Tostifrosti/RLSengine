/* 
	@author RLSmedia, Rick Smeets
*/

function Emitter(point, velocity, emissionRate, maxParticles, spread) {
	this.position = point || new Point(0,0);
	this.velocity = velocity || new Point(0,0);
	this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
	this.color = "#999";

	this.particles = [];
	this.emissionRate = emissionRate || 3;
	this.maxParticles = maxParticles || 1000;
}
Emitter.prototype.emitParticles = function() {
	var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

	var magnitude = this.velocity.getMagnitude();

	var position = new Point(this.position.x, this.position.y);

	var velocity = Point.fromAngle(angle, magnitude);

	return new Particle(position, velocity);
};

Emitter.prototype.addNewParticles = function() {
	if(this.particles.length > this.maxParticles) return;

	for(var i=0; i<this.emissionRate; i++) {
		this.particles.push(this.emitParticles());
	}
};
Emitter.prototype.plotParticles = function(boundsX, boundsY) {
	var currentParticles = [];
	for(var i=0; i<this.particles.length; i++) {
		var particle = this.particles[i];
		var pos = particle.position;
		var x = this.position.x < 0 ? this.position.x : 0;
		var y = this.position.y < 0 ? this.position.y : 0;

		if (pos.x < x || pos.x > boundsX || pos.y < y || pos.y > boundsY) continue;

		particle.move();

		currentParticles.push(particle);
	}

	this.particles = currentParticles;
};

Emitter.prototype.update = function(boundsX, boundsY) {
	this.addNewParticles();
	this.plotParticles(boundsX, boundsY);
};

Emitter.prototype.draw = function(size, color) {
	size = size || 1;
	color = color || "rgb(0,0,255)";
	for(var i=0; i < this.particles.length; i++) {
		var pos = this.particles[i].position;
		RLSengine.Display.fillRect(pos.x, pos.y, size, size, color);
	}
};