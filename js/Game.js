function Game() {
	this.background = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
	this.logo = new Images(RLSengine.ImageManager.getImage("logo"), {x:200, y:300}, 100, 100);
	this.effect = new Effect(this.logo.position, "x", 900, 2.0, 0.0);
}

Game.prototype.update = function() {
	if(!this.effect.isFinished()) {
		this.effect.update();
	} else {
		this.effect.init();
	}
};
Game.prototype.draw = function() {
	RLSengine.Display.fillRect(0, 0, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height, "#FFFFFF");
	this.background.draw();
	this.logo.draw();
};