function AnimationManager() {
	this.animations = {};
}

AnimationManager.prototype.loadXML = function(xml, callback) {
	var callback = callback || {};
	for(var i in xml) {
		try {
			this.animations[i] = {
				name: this.xmlReader[i].getNamedItem("name").value,
				type: parseFloat(this.xmlReader[i].getNamedItem("type").value),
				xOffset: parseFloat(this.xmlReader[i].getNamedItem("xOffset").value),
				yOffset: parseFloat(this.xmlReader[i].getNamedItem("yOffset").value),
				fps: parseFloat(this.xmlReader[i].getNamedItem("fps").value),
				sequence: this.xmlReader[i].getNamedItem("sequence").value,
				spritesheet: this.xmlReader[i].getNamedItem("spritesheet").value,
				width: parseFloat(this.xmlReader[i].getNamedItem("width").value),
				height: parseFloat(this.xmlReader[i].getNamedItem("height").value) 
			};
		} catch(e) { console.error("Error in loading animations: " + e); }
	}
	callback(this.animations);
};
AnimationManager.prototype.load = function(name, type, xOffset, yOffset, fps, sequence, spritesheet, width, height, callback) {
	var callback = callback || {};
	this.animations[i] = {
		name: name,
		type: parseFloat(type),
		xOffset: parseFloat(xOffset),
		yOffset: parseFloat(yOffset),
		fps: parseFloat(fps),
		sequence: sequence,
		spritesheet: spritesheet,
		width: parseFloat(width),
		height: parseFloat(height) 
	};
	callback(this.animations);
};

AnimationManager.prototype.getAnimation = function(name) {
	for(var animation in this.animations) {
		if(animations.name === name) {
			return animation;
		}
	}
	return null;
};