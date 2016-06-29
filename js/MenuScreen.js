function MenuScreen() {
	this.background = new Images(RLSengine.ImageManager.getImage("home"), {x:0, y:0}, RLSengine.Display.canvas.getWidth(), RLSengine.Display.canvas.getHeight());
	this.player = new Animation(RLSengine.ImageManager.getImage("dochter_rechts"), 88, 67.5, [5,6,7,8,9,10], 0);
	this.position = new Point(-this.player.width, 500);
	
	//Button Start
	this.btn_start = new Images(RLSengine.ImageManager.getImage("btn_start"), {x:(RLSengine.Display.canvas.getWidth()/2 - 137), y:100}, 275, 100, 0, true);
	this.btn_start.scale = 0.00;
	this.buttons_anim = new EffectSequence(new Effect(this.btn_start, "scale", 1.10, 0.4, 0), new Effect(this.btn_start, "scale", 0.95, 0.1), new Effect(this.btn_start, "scale", 1.0, 0.1));
	RLSengine.Mouse.mouseDown(this.btn_start, this.btn_start, function() {
		alert("Game still in progress!");
	});

	//Mute Button
	this.btn_mute = new Images(RLSengine.ImageManager.getImage("muteOff"), {x: RLSengine.Display.canvas.getWidth() - 50, y: 25}, 40, 40);
	var btn_mute = this.btn_mute;
	RLSengine.Mouse.mouseUp(this.btn_mute, this.btn_mute, function() {
		if(RLSengine.AudioPlayer.getMute()) {
			btn_mute.setImage(RLSengine.ImageManager.getImage("muteOff"));
			RLSengine.AudioPlayer.setMute(false);
		} else {
			btn_mute.setImage(RLSengine.ImageManager.getImage("muteOn"));
			RLSengine.AudioPlayer.setMute(true);
		}
	});


	RLSengine.Mouse.mouseUp(this.position, this.player, function() {
		alert("Stop slapping the girl!");
	});
	//Emitter / Snow
	//Emitter(point, velocity, emissionRate, maxParticles, spread)
	this.emitters = [new Emitter(new Point(300, -500), Point.fromAngle(1.5, 1), 1, 3000, 2), 
					new Emitter(new Point(600, -500), Point.fromAngle(1.5, 1), 1, 3000, 2), 
					new Emitter(new Point(900, -500), Point.fromAngle(1.5, 1), 1, 3000, 2)];
	RLSengine.AudioPlayer.play("SunnyDay", {volume: 0.5, loop: true});
}

MenuScreen.prototype.update = function() {
	//console.log("Count: " + RLSengine.AudioPlayer.isPlaying.length);
	for(var i=0; i<this.emitters.length; i++) {
		this.emitters[i].update(RLSengine.Display.canvas.getWidth(), RLSengine.Display.canvas.getHeight() - 125);
	}
	this.player.update(8);

	if(!this.buttons_anim.isFinished()) {
		this.buttons_anim.update();
	} else {
		this.buttons_anim.init();
		this.buttons_anim.effects[0].timerStart = 6;
	}

	/*RLSengine.Mouse.click(this.btn_start.position.x, this.btn_start.position.y, this.btn_start.getWidth(), this.btn_start.getHeight(), function() {
		//RLSengine.AudioPlayer.stop("SunnyDay");
		//RLSengine.Display.setScreen(new GameScreen());
		alert("Game still in progress!");
	});*/
	/*var btn_mute = this.btn_mute;
	RLSengine.Mouse.click(this.btn_mute.position.x, this.btn_mute.position.y, this.btn_mute.getWidth(), this.btn_mute.getHeight(), function() {
		if(RLSengine.AudioPlayer.getMute()) {
			btn_mute.setImage(RLSengine.ImageManager.getImage("muteOff"));
			RLSengine.AudioPlayer.setMute(false);
		} else {
			btn_mute.setImage(RLSengine.ImageManager.getImage("muteOn"));
			RLSengine.AudioPlayer.setMute(true);
		}
	});*/

	if(this.position.x >= RLSengine.Display.canvas.getWidth() + this.player.width) {
		this.position.x = -this.player.width;
	} else {
		this.position.x += 2;
	}
};

MenuScreen.prototype.draw = function() {
	RLSengine.Display.fillRect(0, 0, RLSengine.Display.screen.getWidth(), RLSengine.Display.screen.getHeight(), "#000");
	this.background.draw();

	//Animation
	this.player.draw(this.position.x, this.position.y);

	this.emitters[0].draw(4, "rgba(255,255,255,0.2)");
	this.emitters[1].draw(2, "rgba(255,255,255,0.7)");
	this.emitters[2].draw(3, "rgba(255,255,255,0.5)");

	//Button Start
	this.btn_start.draw();

	//Button Mute
	this.btn_mute.draw();
};