/* 
	@author RLSmedia, Rick Smeets
*/

function ImageManager() {
	this._images = {};
	this._isFinished = false;
}
ImageManager.prototype.load = function(sources, callback) {
	var sources = sources || {};
	var images = {};
	var numImages = 0;
	var numLoadedImages = 0;
	var callback = callback || {};
	var self = this;

	for(var src in sources) {
		numImages++;
	}
	for(var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if (++numLoadedImages >= numImages) {
				self._images = images;
				self._isFinished = true;

				callback(images);
			}
		};
		images[src].onerror = function() {
			console.error("Failed To Load Image: " + src);
		};
		images[src].src = sources[src];
		images[src].name = src;
	}
};

ImageManager.prototype.isFinished = function() {
	return this._isFinished;
};
ImageManager.prototype.getAllImages = function() {
	return this._images;
};
ImageManager.prototype.getImage = function(imgName) {
	return this._images[imgName];
}

/*ImageManager.prototype.resize = function(scaleX, scaleY) {
	for(var image in this._images) {
		image.width *= scaleX;
		image.height *= scaleY;
	}
};*/