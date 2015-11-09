function Mouse(canvas, scale) {
	this._canvas = canvas;
	arguments.callee._Up = [];
	arguments.callee._Down = [];
	arguments.callee._Press = [];
	arguments.callee._Move = [];

	arguments.callee._pos = { x: 0.0, y: 0.0 };
	arguments.callee._scale = scale || { x: 1.0, y: 1.0 };
	
	this._init();
}

/* SETUP */
Mouse.prototype._init = function() {
	var self = this;
	if(typeof window === "undefined") return;
	
	//Touch
	window.ontouchstart = function(e) {
		e = e || event; e.preventDefault();
		var t = e.touches[0] || e.changedTouches[0];
		var rect = RLSengine._canvas.getBoundingClientRect();
		if(t) {
			Mouse._pos.x = (t.pageX - rect.left) * Mouse._scale.x;
			Mouse._pos.y = (t.pageY - rect.top) * Mouse._scale.y;
		}
		Mouse._mouseDown(t);
	};
	window.ontouchmove = function(e) {
		e = e || event; e.preventDefault();
		var t = e.touches[0] || e.changedTouches[0];
		var rect = RLSengine._canvas.getBoundingClientRect();
		if(t) {
			Mouse._pos.x = (t.pageX - rect.left) * Mouse._scale.x;
			Mouse._pos.y = (t.pageY - rect.top) * Mouse._scale.y;
		}
		Mouse._mouseMove(t);
	};
	window.ontouchend = function(e) {
		e = e || event; e.preventDefault();
		var t = e.touches[0] || e.changedTouches[0];
		Mouse._mouseUp(t);
	};
	window.ontouchcancel = function(e) {
		e = e || event; e.preventDefault();
		var t = e.touches[0] || e.changedTouches[0];
		Mouse._mouseUp(t);
	};
	//Mouse
	window.onmousedown = function(e) {
		e = e || event; e.preventDefault();
		var rect = RLSengine._canvas.getBoundingClientRect();
		Mouse._pos.x = (e.pageX - rect.left) * Mouse._scale.x;
		Mouse._pos.y = (e.pageY - rect.top) * Mouse._scale.y;
		Mouse._mouseDown(e);
	};
	window.onmousemove = function(e) {
		e = e || event; e.preventDefault();
		var rect = RLSengine._canvas.getBoundingClientRect();
		Mouse._pos.x = (e.pageX - rect.left) * Mouse._scale.x;
		Mouse._pos.y = (e.pageY - rect.top) * Mouse._scale.y;
		
		Mouse._mouseMove(e);
	};
	window.onmouseup = function(e) {
		e = e || event; e.preventDefault();
		Mouse._mouseUp(e);
	};
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		//console.log("msPointerEnabled!");
		window.MSPointerDown = function(e) {
			e = e || event; e.preventDefault();
			var rect = this.getBoundingClientRect();
			Mouse._pos.x = (e.clientX - rect.left) * Mouse._scale.x;
			Mouse._pos.y = (e.clientY - rect.top) * Mouse._scale.y;
			Mouse._mouseDown(e);
		};
		window.MSPointerMove = function(e) {
			e = e || event; e.preventDefault();
			var rect = this.getBoundingClientRect();
			Mouse._pos.x = (e.clientX - rect.left) * Mouse._scale.x;
			Mouse._pos.y = (e.clientY - rect.top) * Mouse._scale.y;
			
			Mouse._mouseMove(e);
		};
		window.MSPointerUp = function(e) {
			e = e || event; e.preventDefault();
			Mouse._mouseUp(e);
		};
	}
};
Mouse.prototype.remove = function() {
	if(typeof window === "undefined") return;
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		window.MSPointerDown = function(e) { };
		window.MSPointerMove = function(e) { };
		window.MSPointerUp = function(e) { };
	} else // For all major browsers, IE 9 and above
	{
		window.ontouchstart = function(e) { };
		window.ontouchmove = function(e) { };
		window.ontouchend = function(e) { };
		window.ontouchcancel = function(e) { };
		window.onmousedown = function(e) { };
		window.onmousemove = function(e) { };
		window.onmouseup = function(e) { };
	}
};

Mouse._mouseUp = function(e) //STATIC
{
	e.x = (e.x || e.clientX);
	e.y = (e.y || e.clientY);
	for(var i=0; i < Mouse._Up.length; i++) {
		if(Mouse._pos.x >= Mouse._Up[i].position.x && Mouse._pos.x <= (Mouse._Up[i].position.x + Mouse._Up[i].image.getWidth()) &&
			Mouse._pos.y >= Mouse._Up[i].position.y && Mouse._pos.y <= (Mouse._Up[i].position.y + Mouse._Up[i].image.getHeight())) {
			Mouse._Up[i].callback();
		}
	}
};
Mouse._mouseDown = function(e) //STATIC
{
	e.x = (e.x || e.clientX);
	e.y = (e.y || e.clientY);
	for(var i=0; i < Mouse._Down.length; i++) {
		if(Mouse._pos.x >= Mouse._Down[i].position.x && Mouse._pos.x <= (Mouse._Down[i].position.x + Mouse._Down[i].image.getWidth()) &&
			Mouse._pos.y >= Mouse._Down[i].position.y && Mouse._pos.y <= (Mouse._Down[i].position.y + Mouse._Down[i].image.getHeight())) {
			Mouse._Down[i].callback();
		}
	}
};
Mouse._mouseMove = function(e) //STATIC
{
	e.x = (e.x || e.clientX);
	e.y = (e.y || e.clientY);
	for(var i=0; i < Mouse._Move.length; i++) {
		if(Mouse._pos.x >= Mouse._Move[i].position.x && Mouse._pos.x <= (Mouse._Move[i].position.x + Mouse._Move[i].image.getWidth()) &&
			Mouse._pos.y >= Mouse._Move[i].position.y && Mouse._pos.y <= (Mouse._Move[i].position.y + Mouse._Move[i].image.getHeight())) {
			Mouse._Move[i].callback();
		}
	}
};

//Add event
Mouse.prototype.mouseUp = function(position, image, callback) {
	if(typeof callback !== "function") return;
	if(typeof position.x !== "number" || typeof position.y !== "number" || 
		typeof image.getWidth !== "function" || typeof image.getHeight !== "function") return;

	Mouse._Up.push({ "position": position, "image": image, "callback": callback });
};
Mouse.prototype.mouseDown = function(position, image, callback) {
	if(typeof callback !== "function") return;
	if(typeof position.x !== "number" || typeof position.y !== "number" || 
		typeof image.getWidth !== "function" || typeof image.getHeight !== "function") return;
	Mouse._Down.push({ "position": position, "image": image, "callback": callback });
};
Mouse.prototype.mouseMove = function(position, image, callback) {
	if(typeof callback !== "function") return;
	if(typeof position.x !== "number" || typeof position.y !== "number" || 
		typeof image.getWidth !== "function" || typeof image.getHeight !== "function") return;
	Mouse._Move.push({ "position": position, "image": image, "callback": callback });
};