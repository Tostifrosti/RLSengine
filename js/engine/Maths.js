/* 
	@author RLSmedia, Rick Smeets
*/

function Maths() {
	this.PI = Math.PI;
	this.RAD_TO_DEG = 180 / Math.PI;
	this.DEG_TO_RAD = Math.PI / 180;	
}

Maths.prototype.distance = function(x1, y1, x2, y2) {
	x1 = x1 || 0; y1 = y1 || 0; 
	x2 = x2 || 0; y2 = y2 || 0;
	
	var xs = x2 - x1;
	var ys = y2 - y1;

	xs = xs * xs;
	ys = ys * ys;

	return Math.sqrt(xs + ys);
};