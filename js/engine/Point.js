/* 
	@author RLSmedia, Rick Smeets
*/

function Point(x, y) {
	x = x || 0;
	y = y || 0;
	this.x = x;
	this.y = y;
}

Point.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};

Point.prototype.add = function(x, y) {
	this.x += x;
	this.y += y;
	return this;
};

Point.prototype.subtract = function(x, y) {
	this.x -= x;
	this.y -= y;
	return this;
};
Point.prototype.multiply = function(x, y) {
	this.x *= x;
	this.y *= y;
	return this;
};
Point.prototype.divide = function(x, y) {
	this.x /= x;
	this.y /= y;
	return this;
};

Point.prototype.equals = function(p) {
	return (p.x === this.x && p.y === this.y);
};
Point.prototype.distance = function(p) {
	var xs = 0;
	var ys = 0;

	xs = p.x - this.x;
	xs = xs * xs;

	ys = p.y - this.y;
	ys = ys * ys;
	
	return Math.sqrt( xs + ys );
};
Point.prototype.toString = function() {
	console.log("Point(" + this.x + "," + this.y + ")");
};

//TODO: floor, ceil, round ?