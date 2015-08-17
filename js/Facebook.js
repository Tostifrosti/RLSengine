/* 
	@author RLSmedia, Rick Smeets
*/

function Facebook() { 
	
}

Facebook.prototype.load = function(APP_ID, debug) {
	window.fbAsyncInit = function() {
        FB.init({
          appId      : APP_ID,
          xfbml      : true,
          version    : 'v2.0',
          cookie     : false
        });
      };

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		if(debug)
			js.src = "//connect.facebook.net/en_US/sdk/debug.js";
		else
			js.src = "//connect.facebook.net/en_US/sdk.js";
 		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
};

Facebook.prototype.share = function(title, caption, description, link, picture, cbSucceed, cbFailed) {
	FB.ui({
		method: 'feed',
		name: title,
		caption: caption,
		description: ( description ),
		link: link,
		picture: picture
	},
	function(response) {
		if (response && response.post_id) {
			if(typeof cbSucceed !== 'undefined')
				cbSucceed();
		} else {
			if(typeof cbFailed !== 'undefined')
				cbFailed();
		}
	});
};