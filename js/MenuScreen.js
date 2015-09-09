function MenuScreen() {
	this.background = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.getWidth(), RLSengine.Display.canvas.getHeight());
	this.anim = new Animation(RLSengine.ImageManager.getImage("dochter_rechts"), 88, 67.5, [5,6,7,8,9,10], 0);
	this.position = new Point(-this.anim.width, 500);
	
	this.btn_start = new Images(RLSengine.ImageManager.getImage("btn_start"), {x:(RLSengine.Display.canvas.getWidth()/2 - 137), y:100}, 275, 100);
	this.btn_start.scale = 0.00;
	this.buttons_anim = new EffectSequence(new Effect(this.btn_start, "scale", 1.10, 0.4), new Effect(this.btn_start, "scale", 0.95, 0.1), new Effect(this.btn_start, "scale", 1.0, 0.1));

	//Emitter(point, velocity, emissionRate, maxParticles, spread)
	this.emitters = [new Emitter(new Point(400, 400), Point.fromAngle(1, -2), 3, 3000, 1), new Emitter(new Point(800, 400), Point.fromAngle(-1, 2), 3, 3000, 1)];
}

MenuScreen.prototype.update = function() {
	for(var i=0; i<this.emitters.length; i++) {
		this.emitters[i].update(RLSengine.Display.canvas.getWidth(), RLSengine.Display.canvas.getHeight());
	}
	this.anim.update(8);
	if(!this.buttons_anim.isFinished()) {
		this.buttons_anim.update();
	} else {
		this.buttons_anim.init();
	}

	RLSengine.Mouse.click(this.btn_start.position.x, this.btn_start.position.y, this.btn_start.getWidth(), this.btn_start.getHeight(), function() {
		RLSengine.Display.setScreen(new GameScreen());
	});

	if(this.position.x >= RLSengine.Display.canvas.getWidth() + this.anim.width) {
		this.position.x = -this.anim.width;
	} else {
		this.position.x += 2;
	}
};

MenuScreen.prototype.draw = function() {
	RLSengine.Display.fillRect(0, 0, RLSengine.Display.screen.getWidth(), RLSengine.Display.screen.getHeight(), "#000");
	this.background.draw();
	
	for(var i=0; i<this.emitters.length; i++) {
		this.emitters[i].draw(3, "rgb(0,0,255)");
	}

	//Animation
	this.anim.draw(this.position.x, this.position.y);

	//Button
	this.btn_start.draw();
};