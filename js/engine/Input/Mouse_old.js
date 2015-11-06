function Mouse(canvas, scale) {
	this._canvas = canvas;
	this._pos = { x: 0.0, y: 0.0 };
	this._lastClicked = { x: 0.0, y: 0.0 };
	//this._clickedOnce = false;
	this._pressed = false;
	this._scale = scale || { x: 1.0, y: 1.0 };
	this._canvas._mouse = this;
	this._init();
}

/* SETUP */
Mouse.prototype._init = function() {
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		this._canvas.addEventListener('MSPointerDown', this._msMouseDown, false);
		this._canvas.addEventListener('MSPointerMove', this._msMouseMove, false);
		this._canvas.addEventListener('MSPointerUp', this._msMouseUp, false);
	} 
	else if(this._canvas.addEventListener) // For all major browsers, IE 9 and above
	{
		this._canvas.addEventListener('touchstart', this._touchStart, false);
		this._canvas.addEventListener('touchmove', this._touchMove, false);
		this._canvas.addEventListener('touchend', this._touchEnd, false);
		this._canvas.addEventListener('touchcancel', this._touchCancel, false);

		this._canvas.addEventListener('mousedown', this._mouseDown, false);
		this._canvas.addEventListener('mousemove', this._mouseMove, false);
		this._canvas.addEventListener('mouseup', this._mouseUp, false);
	}
	else if(this._canvas.attachEvent) // For IE 8 and earlier versions
	{
		this._canvas.attachEvent('onmousedown', this._mousedown);
		this._canvas.attachEvent('onmousemove', this._mouseMove);
		this._canvas.attachEvent('onmouseup', this._mouseUp);
	}
};
Mouse.prototype.remove = function() {
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		this._canvas.removeEventListener('MSPointerDown', this._msMouseDown, false);
		this._canvas.removeEventListener('MSPointerMove', this._msMouseMove, false);
		this._canvas.removeEventListener('MSPointerUp', this._msMouseUp, false);
	} 
	else if(this._canvas.addEventListener) // For all major browsers, IE 9 and above
	{
		this._canvas.removeEventListener('touchstart', this._touchStart, false);
		this._canvas.removeEventListener('touchmove', this._touchMove, false);
		this._canvas.removeEventListener('touchend', this._touchEnd, false);
		this._canvas.removeEventListener('touchcancel', this._touchCancel, false);
		
		this._canvas.removeEventListener('mousedown', this._mouseDown, false);
		this._canvas.removeEventListener('mousemove', this._mouseMove, false);
		this._canvas.removeEventListener('mouseup', this._mouseUp, false);
	} 
	else if(this._canvas.detachEvent) // For IE 8 and earlier versions
	{ 
		this._canvas.detachEvent('onmousedown', this._mouseDown);
		this._canvas.detachEvent('onmousemove', this._mouseMove);
		this._canvas.detachEvent('onmouseup', this._mouseUp);
	}
};


/* MOUSE */
Mouse.prototype._mouseDown = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._lastClicked.x = (e.pageX - rect.left) * this._mouse._scale.x;
	this._mouse._lastClicked.y = (e.pageY - rect.top) * this._mouse._scale.y;
	this._mouse._pos.x = (e.pageX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.pageY - rect.top) * this._mouse._scale.y;
	
	if(!this._mouse._pressed) {
		//this._mouse._clickedOnce = true;
		this._mouse._pressed = true;
	}
};
Mouse.prototype._mouseMove = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._pos.x = (e.pageX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.pageY - rect.top) * this._mouse._scale.y;
	//if(this._mouse._clickedOnce)
		//this._mouse._clickedOnce = false;
};
Mouse.prototype._mouseUp = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._pressed = false;
};


/* WINDOWS MOUSE */
Mouse.prototype._msMouseDown = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._lastClicked.x = (e.clientX - rect.left) * this._mouse._scale.x;
	this._mouse._lastClicked.y = (e.clientY - rect.top) * this._mouse._scale.y;
	this._mouse._pos.x = (e.clientX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.clientY - rect.top) * this._mouse._scale.y;

	if(!this._mouse._pressed) {
		//this._mouse._clickedOnce = true;
		this._mouse._pressed = true;
	}
};
Mouse.prototype._msMouseMove = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._pos.x = (e.clientX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.clientY - rect.top) * this._mouse._scale.y;
	//if(this._mouse._clickedOnce)
		//this._mouse._clickedOnce = false;
};
Mouse.prototype._msMouseUp = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._pressed = false;
};


/* TOUCH */
Mouse.prototype._touchStart = function(e) {
	e = e || event;
	e.preventDefault();
	var t = e.touches[0] || e.changedTouches[0];
	var rect = this.getBoundingClientRect();
	if(t) {
		this._mouse._lastClicked.x = (t.pageX - rect.left) * this._mouse._scale.x;
		this._mouse._lastClicked.y = (t.pageY - rect.top) * this._mouse._scale.y;
		this._mouse._pos.x = (t.pageX - rect.left) * this._mouse._scale.x;
		this._mouse._pos.y = (t.pageY - rect.top) * this._mouse._scale.y;
	}
	if(!this._mouse._pressed) {
		//this._mouse._clickedOnce = true;
		this._mouse._pressed = true;
	}
};
Mouse.prototype._touchMove = function(e) {
	e = e || event;
	e.preventDefault();
	var t = e.touches[0] || e.changedTouches[0];
	var rect = this.getBoundingClientRect();
	if(t) {
		this._mouse._pos.x = (t.pageX - rect.left) * this._mouse._scale.x;
		this._mouse._pos.y = (t.pageY - rect.top) * this._mouse._scale.y;
	}
	//if(this._mouse._clickedOnce)
		//this._mouse._clickedOnce = false;
};
Mouse.prototype._touchEnd = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._pressed = false;
};
Mouse.prototype._touchCancel = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._pressed = false;
};


/* Methods for global use */

Mouse.prototype.getPos = function() {
	return { x: this._pos.x, y: this._pos.y };
};
/* is not working correctly, yet!! */
/*Mouse.prototype.isClicked = function() {
	return this._clickedOnce;
};*/
Mouse.prototype.isPressed = function() {
	return this._pressed;
};
Mouse.prototype.getPosClicked = function() {
	return { x: this._lastClicked.x, y: this._lastClicked.y };	
};
Mouse.prototype.click = function(x, y, width, height, callback) {
	if(this._pos.x >= x && this._pos.x <= (x + width) &&
		this._pos.y >= y && this._pos.y <= (y + height) && this._pressed) {
		if(typeof(callback) !== "undefined") {
			callback();
		}
		return true;
	}
	return false;
};

Mouse.prototype.move = function(x, y, width, height, callback) {
	if(this._pos.x >= x && this._pos.x <= (x + width) &&
		this._pos.y >= y && this._pos.y <= (y + height)) {
		if(typeof(callback) !== "undefined") {
			callback();
		}
		return true;
	}
	return false;
};