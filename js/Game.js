function Game() {
	this.timer = new Timer(3.0);
}

Game.prototype.update = function() {
	if(!this.timer.isFinished()) {
		this.timer.update();
	} else {
		RLSengine.Display.setScreen(new MenuScreen());
	}

};
Game.prototype.draw = function() {
	RLSengine.Display.fillRect(0, 0, RLSengine.Display.screen.width, RLSengine.Display.screen.height, "#000");
	RLSengine.Display.drawText(RLSengine.Display.canvas.width/2 - 185, RLSengine.Display.canvas.height/2 - 20, "Made By Rick Smeets", "#FFF", "40px Calibri");
};