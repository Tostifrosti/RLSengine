/* 
	@author RLSmedia, Rick Smeets
*/

function Location(options) {
	arguments.callee.coords = {
		latitude: 0.0,
		longitude: 0.0,
		accuracy: 0,
	};
	this.radius = 6371; // radius of the Earth in km
	this.options = options || {
		enableHighAccuracy: false,
		timeout: 30000, //time in miliseconds, else errorHandler is called.
		maximumAge: 0 //Set maximum age before relocating, default: 0 = always recalculating
	};
	arguments.callee._callback = {};
}

Location.prototype.requestLocation = function(callback) {
	Location._callback = callback || {};
	if(navigator.geolocation) {
		//navigator.getLocation.getCurrentPosition(succesHandler, errorHandler, positionOptions);
		navigator.geolocation.getCurrentPosition(this.displayLocation, this.errorHandler, this.options);
	} else {
		//No Support
		if(RLSengine.DevMode) console.log("No support for location!");
	}
};
Location.prototype.displayLocation = function(position) {
	Location.coords.latitude = position.coords.latitude;
	Location.coords.longitude = position.coords.longitude;
	Location.coords.accuracy = position.coords.accuracy;
	Location._callback();
};
Location.prototype.errorHandler = function(e) {
	var errorTypes = {
		0: "Unkown error",
		1: "Permission denied from user",
		2: "Position is not available",
		3: "Request timed out"
	};

	if(RLSengine.DevMode) console.log("Error: " + errorTypes[e.code] + "!");
	return errorTypes[e.code];
};
Location.prototype.getCoords = function() {
	return Location.coords;
}