/* 
	@author RLSmedia, Rick Smeets
*/

function XMLreader() {
	this._results = {};
	this._finished = false;
}


XMLreader.prototype.load = function(sources, callback) {
	var self = this;
	var sources = sources || {};
	var numXML = 0;
	var numXMLLoaded = 0;
	var xml = {};
	var callback = callback || {};

	for(var name in sources) {
		numXML++;
	}

	for(var name in sources) {
		var url = sources[name];
		if(window.XMLHttpRequest) {
			//for IE7+, Firefox, Chrome, Safari, Opera
			xml[name] = new XMLHttpRequest();
		} else {
			// IE5, IE6
			xml[name] = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xml[name].onload = function() {
			if(this.readyState === 4 && this.status === 200) {
				if(this.responseXML !== null) {
					var doc = this.responseXML;
					var elementTag = doc.getElementsByTagName(name);
					
					for(var i=0; i < elementTag.length; i++) {
						xml[name][i] = elementTag.item(i).attributes;
					}
					if(++numXMLLoaded >= numXML) {
						self._results = xml;
						self._finished = true;
						callback(xml);
					}
					
				} else {
					self._finished = false;
					alert("Something is wrong with the document!");
				}
			} else {
				self._finished = false;
				console.error("Something went wrong!, xml cannot load... Please try again.");
			}
		};

		xml[name].onerror = function(e) {
			console.error("Something went wrong! " + e);
		};

		//Method, url async
		xml[name].src = sources[name];
		xml[name].name = name;

		xml[name].open("GET", url, true);
		xml[name].setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xml[name].overrideMimeType('text/xml');
		xml[name].send(null);
	}
};
XMLreader.prototype.getResults = function() {
	return this._results;
};
XMLreader.prototype.getXML = function(name) {
	return this._results[name];
};
XMLreader.prototype.isFinished = function() {
	return this._finished;
};