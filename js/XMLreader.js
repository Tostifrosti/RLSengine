/* 
	@author RLSmedia, Rick Smeets
*/

function XMLreader() {
	this._xmlHttp = null;
	this._xmlDoc = null;
	this._results = {};
	this._finished = false;

	if(window.XMLHttpRequest) {
		//for IE7+, Firefox, Chrome, Safari, Opera
		this._xmlHttp = new XMLHttpRequest();
	} else {
		// IE5, IE6
		this._xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

}


XMLreader.prototype.load = function(url, tagname, callback) {
	var self = this;
	var callback = callback || {};
	this._xmlHttp.onload = function() {
		if(this.readyState === 4 && this.status === 200) {
			if(this.responseXML !== null) {
				self._finished = true;
				self._xmlDoc = this.responseXML;
				var elementTag = self._xmlDoc.getElementsByTagName(tagname);
				
				for(var i=0; i < elementTag.length; i++) {
					self._results[i] = elementTag.item(i).attributes;
				}
				callback(self._results);
			} else {
				self._finished = false;
				alert("Something is wrong with the document!");
			}
		} else {
			self._finished = false;
			console.error("Something went wrong!, xml cannot load... Please try again.");
		}
	};
	this._xmlHttp.onerror = function(e) {
		console.error("Something went wrong! " + e);
	};
	//Method, url async
	this._xmlHttp.open("GET", url, true);
	this._xmlHttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	this._xmlHttp.overrideMimeType('text/xml');
	this._xmlHttp.send();
};
XMLreader.prototype.getResults = function() {
	return this._results;
};
XMLreader.prototype.isFinished = function() {
	return this._finished;
};