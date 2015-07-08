Login = {
	facebook: function(){
		Meteor.loginWithFacebook({
			loginStyle: "popup",
			requestPermissions: ['public_profile', 'email', 'user_friends']
		}, function(error){
			if(error){ console.log("Cannot connect to facebook."); }
			else{ console.log("Logged in:"); console.log(Meteor.user()); }
		});
	},
	twitter: function(){
		Meteor.loginWithTwitter({
			loginStyle: "popup"
		}, function(error){
			if(error){ console.log("Cannot connect to twitter."); }
			else{ console.log("Logged in:"); console.log(Meteor.user()); }
		});
	},
	google: function(){
		Meteor.loginWithGoogle({
			loginStyle: "popup",
			requestPermissions: ['openid', 'email', 'profile']
		}, function(error){
			if(error){ console.log("Cannot connect to google."); }
			else{ console.log("Logged in:"); console.log(Meteor.user()); }
		});
	}
}

MessageUtils = {
	getDisplayable: function(msg){
		if (msg.user){ return msg.user.name; }
		else{ return msg.nick; }
	}
}

Utils = {
	mstostr: function(milliseconds){
		function numberEnding (number){ return (number > 1) ? 's' : ''; }
		var temp = Math.floor(milliseconds / 1000);
		var years = Math.floor(temp / 31536000);
		if (years && years>=0) {
			return years + ' yr' + numberEnding(years) + ' ago';
		}
		var days = Math.floor((temp %= 31536000) / 86400);
		if (days && days>=0) {
			return days + ' day' + numberEnding(days) + ' ago';
		}
		var hours = Math.floor((temp %= 86400) / 3600);
		if (hours && hours>=0) {
			return hours + ' hr' + numberEnding(hours) + ' ago';
		}
		var minutes = Math.floor((temp %= 3600) / 60);
		if (minutes && minutes>=0) {
			return minutes + ' min' + numberEnding(minutes) + ' ago';
		}
		var seconds = temp % 60;
		if (seconds && seconds>=0) {
			return seconds + ' sec' + numberEnding(seconds) + ' ago';
		}
		return 'just now';
	}
}

Domain = {
	getPrefix: function(url){
		var match = url.match(/(\w)*:\/\//gi);
		if (match && match.length > 0){ return match[0]; }
		return null;
	},
	removePrefix: function(url){
		var prefix = Domain.getPrefix(url);
		if (prefix){ return url.replace(prefix, ""); }
		else{ return url; }
	},
	removeParams: function(url){
		url = Domain.removePrefix(url);
		url = url.split("?")[0];
		url = url.split("#")[0];
		url = url.split("/")[0];
		return url;
	},
	getUrlParams: function(url){
		url = Domain.removePrefix(url);
		var arr = url.match(/[?&][^?&]*/gi);
		var returnarr = {};
		for(var i = 0; i < arr.length; i++){
			arr[i] = arr[i].replace(/[?&]/gi, "");
			var parts = arr[i].split("=");
			returnarr[parts[0]] = parts[1];
		}
		if (returnarr){ return returnarr; }
		else{ return null; }
	},
	cleanURL: function(url){
		url = decodeURIComponent(url);
    	// remove http htpps ftp or whatever
    	url = Domain.removePrefix(url);
    	// remove whatever is after the hash
    	url = url.split("#")[0];
    	// if url ends with slash, remove it
    	if (url.substr(-1)=="/"){ url = url.substr(0,url.length-1); }
    	return url;
    }
}