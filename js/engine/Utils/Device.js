/* 
	@author RLSmedia, Rick Smeets
*/
function Device() {
	this.init();
}

Device.prototype.init = function() {
	this.ua = window.navigator.userAgent.toLowerCase();
	this.isAndroid = /android/.test(this.ua) ? true : false;
	this.isiOS = /(iphone|ipod|ipad)/.test(this.ua) ? true : false;
	this.isWP = /windows phone/.test(this.ua) ? true : false;

	this.isStandAlone = window.navigator.standalone ? true : false;
	this.isiPad = this.ua.match(/ipad/) ? true : false;
	this.isiPod = this.ua.match(/ipod/) ? true : false;
	this.isiPhone = this.ua.match(/iphone/) ? true : false;

	//Firefox will have touch disabled but can be enabled in about:config -> dom.w3c_touch_events.enabled : disable=(0) enable=(1) auto-detect=(2)
	this.hasTouch = (('ontouchstart' in window) || ('touchstart' in window) || ('onmsgesturechange' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) ? true : false;
	this.isOpera = this.ua.indexOf("opr") > -1;
	this.isKindle = /kindle/i.test(this.ua) || /silk/i.test(this.ua) || /kftt/i.test(this.ua) || /kfot/i.test(this.ua) || /kfjwa/i.test(this.ua) || /kfjwi/i.test(this.ua) || /kfsowi/i.test(this.ua) || /kfthwa/i.test(this.ua) || /kfthwi/i.test(this.ua) || /kfapwa/i.test(this.ua) || /kfapwi/i.test(this.ua);
	this.isBlackBerry = (this.ua.indexOf("bb") > -1 || this.ua.indexOf("blackberry") > -1);
	this.isMoz = this.ua.indexOf("firefox") > -1;
	this.isIE = (this.ua.indexOf("msie") > 0 || this.ua.indexOf("trident") > 0 || this.ua.indexOf("edge") > 0) ? true : false;
	this.isChrome = (this.ua.indexOf("chrome") > -1 && this.isOpera === false);
	this.isSafari = (this.ua.indexOf("safari") > -1 && this.isChrome === false && this.isOpera === false && this.isKindle === false && this.isBlackBerry === false);
};