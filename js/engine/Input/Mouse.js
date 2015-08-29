function Mouse(canvas, scale) {
	this._canvas = canvas;
	this._pos = { x: 0.0, y: 0.0 };
	this._lastClicked = { x: 0.0, y: 0.0 };
	this._clickedOnce = false;
	this._mouseDown = false;
	this._scale = scale || { x: 1.0, y: 1.0 };
	this._canvas._mouse = this;
	this.init();
}

Mouse.prototype.init = function() {
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		this._canvas.addEventListener('MSPointerDown', this.msClickDown, false);
		this._canvas.addEventListener('mousemove', this.msMove, false);
		this._canvas.addEventListener('MSPointerUp', this.msClickUp, false);
	} 
	else if(this._canvas.addEventListener) // For all major browsers, IE 9 and above
	{
		this._canvas.addEventListener('touchstart', this.touchStart, false);
		this._canvas.addEventListener('touchmove', this.touchMove, false);
		this._canvas.addEventListener('touchend', this.touchEnd, false);
		this._canvas.addEventListener('touchcancel', this.touchCancel, false);

		this._canvas.addEventListener('mousedown', this.mouseDown, false);
		this._canvas.addEventListener('mousemove', this.move, false);
		this._canvas.addEventListener('mouseup', this.mouseUp, false);
	} 
	else if(this._canvas.attachEvent) // For IE 8 and earlier versions
	{
		this._canvas.attachEvent('onclick', this.mousedown);
		this._canvas.attachEvent('onmousemove', this.move);
	}
};

Mouse.prototype.remove = function() {
	if(window.navigator.msPointerEnabled) // For Windows Phone
	{
		this._canvas.removeEventListener('MSPointerDown', this.msClickDown, false);
		this._canvas.removeEventListener('mousemove', this.msMove, false);
		this._canvas.removeEventListener('MSPointerUp', this.msClickUp, false);
	} 
	else if(this._canvas.addEventListener) // For all major browsers, IE 9 and above
	{
		this._canvas.removeEventListener('touchstart', this.touchStart, false);
		this._canvas.removeEventListener('touchmove', this.touchMove, false);
		this._canvas.removeEventListener('touchend', this.touchEnd, false);
		this._canvas.removeEventListener('touchcancel', this.touchCancel, false);
		
		this._canvas.removeEventListener('mousedown', this.mouseDown, false);
		this._canvas.removeEventListener('mousemove', this.move, false);
		this._canvas.removeEventListener('mouseup', this.mouseUp, false);
	} 
	else if(this._canvas.detachEvent) // For IE 8 and earlier versions
	{ 
		this._canvas.detachEvent('onclick', this.mousedown);
		this._canvas.detachEvent('onmousemove', this.move);
	}
};

/* MOUSE */
Mouse.prototype.mouseDown = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._lastClicked.x = (e.pageX - rect.left);
	this._mouse._lastClicked.y = (e.pageY - rect.top);
	
	if(!this._mouse._mouseDown) {
		//this._mouse._clickedOnce = true;
		this._mouse._mouseDown = true;
	}
};
Mouse.prototype.move = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._pos.x = (e.pageX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.pageY - rect.top) * this._mouse._scale.y;
	//if(this._mouse._clickedOnce)
		//this._mouse._clickedOnce = false;
};

Mouse.prototype.mouseUp = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._mouseDown = false;
};

/* WINDOWS MOUSE */
Mouse.prototype.msClickDown = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._pos.x = (e.clientX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.clientY - rect.top) * this._mouse._scale.y;

	if(!this._mouse._mouseDown) {
		//this._mouse._clickedOnce = true;
		this._mouse._mouseDown = true;
	}
};
Mouse.prototype.msMove = function(e) {
	e = e || event;
	e.preventDefault();
	var rect = this.getBoundingClientRect();
	this._mouse._pos.x = (e.clientX - rect.left) * this._mouse._scale.x;
	this._mouse._pos.y = (e.clientY - rect.top) * this._mouse._scale.y;
	//if(this._mouse._clickedOnce)
		//this._mouse._clickedOnce = false;
};
Mouse.prototype.msClickUp = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._mouseDown = false;
};

/* TOUCH */
Mouse.prototype.touchStart = function(e) {
	e = e || event;
	e.preventDefault();
	var t = e.touches[0] || e.changedTouches[0];
	var rect = this.getBoundingClientRect();
	if(t) {
		this._mouse._lastClicked.x = (t.pageX - rect.left) * this._mouse._scale.x;
		this._mouse._lastClicked.y = (t.pageY - rect.top) * this._mouse._scale.y;
	}
	if(!this._mouse._mouseDown) {
		//this._mouse._clickedOnce = true;
		this._mouse._mouseDown = true;
	}
};
Mouse.prototype.touchMove = function(e) {
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

Mouse.prototype.touchEnd = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._mouseDown = false;
};
Mouse.prototype.touchCancel = function(e) {
	e = e || event;
	e.preventDefault();
	//this._mouse._clickedOnce = false;
	this._mouse._mouseDown = false;
};

Mouse.prototype.click = function(x, y, width, height, callback) {
	if(this._pos.x >= x && this._pos.x <= (x + width) &&
		this._pos.y >= y && this._pos.y <= (y + height) && this._mouseDown) {
		if(typeof(callback) !== "undefined") {
			callback();
		}
	}
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
	return this._mouseDown;
};
Mouse.prototype.getPosClicked = function() {
	return { x: this._lastClicked.x, y: this._lastClicked.y };	
};

Mouse.prototype.clickOnItem = function(posX, posY, width, height) {
	if(this._isClicked) {
		if (this._lastClicked.x >= posX && this._lastClicked.x <= (posX + width) &&
			this._lastClicked.y >= posY && this._lastClicked.y <= (posY + height)) {
			return true;
		}
	}
	return false;
};
Mouse.prototype.moveOnItem = function(posX, posY, width, height) {
	if(!this._isClicked) {
		if (this._pos.x >= posX && this._pos.x <= (posX + width) &&
			this._pos.y >= posY && this._pos.y <= (posY + height)) {
			return true;
		}
	}
	return false;
};