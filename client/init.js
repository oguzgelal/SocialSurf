Meteor.startup(function() {

	if (!amplify.store("nickname")){
		var rand1 = String(Math.floor(Math.random() * 10));
		var rand2 = String(Math.floor(Math.random() * 10));
		var rand3 = String(Math.floor(Math.random() * 10));
		var rand4 = String(Math.floor(Math.random() * 10));
		amplify.store("nickname", "Anonymouse"+rand1+rand2+rand3+rand4);
	}

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

});
