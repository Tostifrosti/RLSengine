/* 
	@author RLSmedia, Rick Smeets
*/

function Images(image, position, width, height) {
	this.image = image;
	//this.position = position || {x:0, y:0};
	this.x = position.x;
	this.y = position.y;
	this.width = width || this.image.width;
	this.height = height || this.image.height;
	this.scale = 1.0;
	this.alpha = 1.0;
}


Images.prototype.draw = function() {
	//img, srcX, srcY, srcW, srcH, posX (s), posY (s), w (s), h (s)
	RLSengine.Display.drawImage(this.image, 0, 0, this.image.width, this.image.height, (this.x + (this.width/2)) - ((this.width/2) * this.scale), (this.y + (this.height/2)) - ((this.height/2) * this.scale), this.width * this.scale, this.height * this.scale, this.alpha);
};
Images.prototype.getX = function() {
	return this.x * this.scale;
};
Images.prototype.getY = function() {
	return this.y * this.scale;
};
Images.prototype.getWidth = function() {
	return this.width * this.scale;
};
Images.prototype.getHeight = function() {
	return this.height * this.scale;
};
Images.prototype.setImage = function(img) {
	this.image = img;
};
