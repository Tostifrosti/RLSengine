/**
* {Class} Connection
*
* @param {string} url, The url of the host.
* @param {string/array} options, TODO.
* 
* WebSocket: https://www.w3.org/TR/2011/WD-websockets-20110419/
* Security: https://devcenter.heroku.com/articles/websocket-security
*/
function Connection(url, options)
{
	this.host = (url.search("://") >= 0) ? url.split("://", 2)[1] : url;
	this.protocol = (url.search("https") >= 0) ? "wss" : "ws"; // scheme: ws or wss (like: http / https)
	this.secure = this.protocol === "wss";
	this.port = (this.secure) ? "443" : "80";
	this.options = options || []; // soap, json, chat TODO?? -> {} met port (string), secure (boolean), binaryType (string), protocol? (string) 
	this.socket = null;
	this.binaryType = "blob"; // blob, arraybuffer
	this.connected = false;
	if(!window.WebSocket && !window.MozWebSocket) {
		alert("WebSocket is not supported in your browser!");
	}
}

Connection.prototype.connect = function(onComplete) {
	if(!window.WebSocket && !window.MozWebSocket) {
		alert("WebSocket is not Suppoted in this browser!");
		return;
	}
	var onComplete = (typeof onComplete !== "undefined") ? onComplete : function() {};
	var self = this;
	
	//SOCKET READY STATE: 
	//	CONNECTING = 0,  //The connection has not yet been established.
	//	OPEN = 1, 		 //The WebSocket connection is established and communication is possible.
	//	CLOSING =  2, 	 //The connection is going through the closing handshake.
	//	CLOSED = 3		 //The connection has been closed or could not be opened.

	try {
		log("Connecting to server...");
		if("WebSocket" in window)
			this.socket = new WebSocket(this.protocol + "://" + this.host, this.options); //Start connection
		else if("MozWebSocket" in window)
			this.socket = new MozWebSocket(this.protocol + "://" + this.host, this.options); //Start connection
		else
			return;
		this.socket.binaryType = this.binaryType; // Set binarytype
		
		this.socket.onopen = function() {
			//WebSocket is connected, send data using send()
			log("Connection is established! (Socket Status: " + this.readyState + ")");
			self.connected = true;
			onComplete(self); // Connection is open!
		};
		this.socket.onclose = function() {
			//WebSocket is closed!
			log("Connection is closed! (Socket Status: " + this.readyState + ")");
			self.connected = false;
		};
		this.socket.onerror = function(err) {
			//WebSocket has an error!
			error("WebSocket has an unexpected error! (Socket Status: " + this.readyState + ")");
		};
	} catch(exception) {
		log("Something went wrong... (" + exception + ")");
		this.connected = false;
	}
};

Connection.prototype.send = function(msg) {
	if(this.socket == null) { error("No connection has been established!"); return; }
	if(this.socket.readyState === window.WebSocket.OPEN) {
		var msg = JSON.stringify(msg); //JSON for safety
		try {
			this.socket.send(msg); // @param {string} data
			if(this.socket.bufferedAmount === 0) {
				return true;
			} else {
				return false;
			}
		} catch(exception) {
			log("Something went wrong... (" + exception + ")");
			return false;
		}
	}
};

Connection.prototype.recieve = function(callback) {
	if(this.socket == null) { error("No connection has been established!"); return; }
	var callback = (typeof callback !== "undefined") ? callback : function() {};
	this.socket.onmessage = function(msg) {
		//WebSocket has recieved a message!
		callback(JSON.parse(msg.data)); //JSON for safety
	};
};

Connection.prototype.close = function() {
	if(this.socket == null) { error("No connection has been established!"); return; }
	if(this.socket.readyState == window.WebSocket.CONNECTING || this.socket.readyState == window.WebSocket.OPEN) {
		try {
			this.socket.close(); // @param {long} status code, @param {string} reason
		} catch(exception) {
			log("Something went wrong... (" + exception + ")");
		}
	}
};

