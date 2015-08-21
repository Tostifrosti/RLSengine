function Game() {
	this.background = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
	this.img = new Images(RLSengine.ImageManager.getImage("logo"), {x:200, y:300}, 100, 100);
	this.effect = new Effect(this.img.position, "x", 700);
}

Game.prototype.update = function() {
	if(!this.effect.isFinished()) {
		this.effect.update();
	} else {
		this.effect.init();
	}
};
Game.prototype.draw = function() {
	RLSengine._ctx.fillStyle = "#FFFFFF";
	RLSengine._ctx.fillRect(0, 0, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
	this.background.draw();
	this.img.draw();
};