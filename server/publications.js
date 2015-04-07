Meteor.publish('rooms', function(url){
	return Rooms.find({url: url});
});

Meteor.publish('messages', function(roomid){
	return Messages.find({roomid: roomid});
});

Meteor.publish('online', function(urlVar){
	return Online.find({url: urlVar});
});

Meteor.publish("userData", function(userid) {
	return Meteor.users.find({_id: userid});
});