function Keyboard(canvas) {
	this._canvas = canvas;
	arguments.callee._eventsUp = [];
	arguments.callee._eventsDown = [];
	arguments.callee._eventsPress = [];
	
	this.init();
}

Keyboard.prototype.init = function() {
	/* 
	keydown
	keypress <- only this one, works with capital letters!
	keydown
	*/

	//Global KeyEvents
	window.onkeyup = function(e) {
		Keyboard._keyUp(e);
	};
	window.onkeydown = function(e) {
		Keyboard._keyDown(e);
	};
	window.onkeypress = function(e) {
		Keyboard._keyPress(e);
	};
};

Keyboard._keyUp = function(e) { //static
	var key = e.keyCode ? e.keyCode : e.which;
	for(var i=0; i<Keyboard._eventsUp.length; i++) {
		if(Keyboard._eventsUp[i].keycode === key) {
			Keyboard._eventsUp[i].callback(key);
		}
	}
};
Keyboard._keyDown = function(e) { //static
	var key = e.keyCode ? e.keyCode : e.which;
	for(var i=0; i<Keyboard._eventsDown.length; i++) {
		if(Keyboard._eventsDown[i].keycode === key) {
			Keyboard._eventsDown[i].callback(key);
		}
	}
};
Keyboard._keyPress = function(e) { //static
	var key = e.keyCode ? e.keyCode : e.which;
	for(var i=0; i<Keyboard._eventsPress.length; i++) {
		if(Keyboard._eventsPress[i].keycode === key) {
			Keyboard._eventsPress[i].callback(key);
		}
	}
};

//Add event
Keyboard.prototype.keyUp = function(key, callback) {
	if(typeof key === "string") key = key.charCodeAt(0);
	if(typeof callback !== "function") return;
	Keyboard._eventsUp.push({"keycode":key, "callback":callback});
};
Keyboard.prototype.keyDown = function(key, callback) {
	if(typeof key === "string") key = key.charCodeAt(0);
	if(typeof callback !== "function") return;
	Keyboard._eventsDown.push({"keycode":key, "callback":callback});
};
Keyboard.prototype.keyPress = function(key, callback) {
	if(typeof key === "string") key = key.charCodeAt(0);
	if(typeof callback !== "function") return;
	Keyboard._eventsPress.push({"keycode":key, "callback":callback});
};

//Remove event
Keyboard.prototype.removeKeyUp = function(key) {
	if(typeof key === "string") key = key.charCodeAt(0);
	for(var i=0; i<Keyboard._eventsUp.length; i++) {
		if(Keyboard._eventsUp[i].keycode === key) {
			Keyboard._eventsUp.shift(i);
		}
	}
};
Keyboard.prototype.removeKeyDown = function(key) {
	if(typeof key === "string") key = key.charCodeAt(0);
	for(var i=0; i<Keyboard._eventsDown.length; i++) {
		if(Keyboard._eventsDown[i].keycode === key) {
			Keyboard._eventsDown.shift(i);
		}
	}
};
Keyboard.prototype.removeKeyPress = function(key) {
	if(typeof key === "string") key = key.charCodeAt(0);
	for(var i=0; i<Keyboard._eventsPress.length; i++) {
		if(Keyboard._eventsPress[i].keycode === key) {
			Keyboard._eventsPress.shift(i);
		}
	}
};
Keyboard.remove = function() { //static
	Keyboard._eventsUp = [];
	Keyboard._eventsDown = [];
	Keyboard._eventsPress = [];
};

//Properties
Keyboard.prototype.getChar = function(e) {
	return String.fromCharCode(e.which || e.keyCode) || null;
};
