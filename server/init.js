Meteor.startup(function() {
	
	// If no data present, add initial rooms
	if (Rooms.find({}).count() == 0){ Meteor.call("bootstrap"); }

	// Configure services automatically on db resets
	ServiceConfiguration.configurations.upsert({service:"facebook"}, {
		$set:{
			appId: "394250894092823",
			loginStyle: "popup",
			secret: "c642a4c09fe8ec65d438c1673e21db68"
		}
	});

	// Reset online counts on server startup
	Online.remove({});

});