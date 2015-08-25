function Game() {
	this.background = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height);
	//this.logo = new Images(RLSengine.ImageManager.getImage("logo"), {x:200, y:300}, 100, 100);
	//this.effect = new Effect(this.logo.position, "x", 900, 2.0, 0.0);

	this.anim = new Animation(RLSengine.ImageManager.getImage("dochter_rechts"), 88, 67.5, [5,6,7,8,9,10], 0);
	this.position = new Point(600, 500);
}

Game.prototype.update = function() {
	if(!this.anim.isFinished())
		this.anim.update(8);
	if(this.position.x <= 900)
		this.position.x++;
	else 
		this.position.x = 600;

	/*if(!this.effect.isFinished()) {
		this.effect.update();
	} else {
		this.effect.init();
	}*/

};
Game.prototype.draw = function() {
	//RLSengine.Display.fillRect(0, 0, RLSengine.Display.canvas.width, RLSengine.Display.canvas.height, "#000000");
	this.background.draw();
	//this.logo.draw();
	this.anim.draw(this.position.x, this.position.y);
};