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
			return years + ' year' + numberEnding(years) + ' ago';
		}
		var days = Math.floor((temp %= 31536000) / 86400);
		if (days && days>=0) {
			return days + ' day' + numberEnding(days) + ' ago';
		}
		var hours = Math.floor((temp %= 86400) / 3600);
		if (hours && hours>=0) {
			return hours + ' hour' + numberEnding(hours) + ' ago';
		}
		var minutes = Math.floor((temp %= 3600) / 60);
		if (minutes && minutes>=0) {
			return minutes + ' minute' + numberEnding(minutes) + ' ago';
		}
		var seconds = temp % 60;
		if (seconds && seconds>=0) {
			return seconds + ' second' + numberEnding(seconds) + ' ago';
		}
		return 'just now';
	}
}