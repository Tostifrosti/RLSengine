function Game() {
	this.img = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
}

Game.prototype.update = function() {
	
};
Game.prototype.draw = function() {
	RLSengine._ctx.fillStyle = "#FFFFFF";
	RLSengine._ctx.fillRect(0, 0, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
	this.img.draw();
};