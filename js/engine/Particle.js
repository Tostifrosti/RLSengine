/* 
	@author RLSmedia, Rick Smeets
*/

function Particle(point, velocity, acceleration) {
	this.position = point || new Point(0,0);
	this.velocity = velocity || new Point(0,0);
	this.acceleration = acceleration || new Point(0,0);
}

Particle.prototype.move = function() {
	this.velocity.add(this.acceleration.x, this.acceleration.y);
	this.position.add(this.velocity.x, this.velocity.y);
};