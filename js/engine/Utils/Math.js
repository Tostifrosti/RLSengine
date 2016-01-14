/* 
	@author RLSmedia, Rick Smeets
*/

if(typeof Math !== 'object') {
	var Math = {
		PI: 3.14159265359,
		TO_DEGREES: (180 / this.PI),
		TO_RADIANS: (this.PI / 180)
	};
} else {
	Math.TO_DEGREES = (180 / Math.PI);
	Math.TO_RADIANS = (Math.PI / 180);
}

Math.distance = function(x1, y1, x2, y2) {
	x1 = x1 || 0; y1 = y1 || 0; 
	x2 = x2 || 0; y2 = y2 || 0;
	
	var xs = x2 - x1;
	var ys = y2 - y1;

	xs = xs * xs;
	ys = ys * ys;

	return Math.sqrt(xs + ys);
};

Math.degreesToDecimal = function(degrees, minutes, seconds) {
	return degrees + (minutes / 60) + (seconds / 3600.0);
};
Math.degreesToRadians = function(degrees) {
	var radians = (degrees * Math.PI) / 180;
	return radians;
};

Math.isNumeric = function(n) { 
	return !isNaN(parseFloat(n)) && isFinite(n);
};
