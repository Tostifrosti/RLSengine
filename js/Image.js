/* 
	@author RLSmedia, Rick Smeets
*/

function Images(image, position, width, height) {
	this.image = image;
	this.position = position || {x:0, y:0};
	this.width = width || this.image.width;
	this.height = height || this.image.height;
}



Images.prototype.draw = function() {
	//img, srcX, srcY, srcW, srcH, posX (s), posY (s), w (s), h (s)
	RLSengine._ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.position.x, this.position.y, this.width, this.height);
};

Images.prototype.getWidth = function() {
	return this.width;
};
Images.prototype.getHeight = function() {
	return this.height;
};

