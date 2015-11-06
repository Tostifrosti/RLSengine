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
	var text = "Made By Rick Smeets";
	RLSengine.Display.drawText(RLSengine.Display.canvas.getWidth()/2 - RLSengine.Display.getTextWidth(text), RLSengine.Display.canvas.getHeight()/2 - 20, text, "#FFF", 40, "Calibri");
};