Meteor.publish('rooms', function(url){
	return Rooms.find({url: url});
});

Meteor.publish('messages', function(roomid, limit){
	return Messages.find({roomid: roomid},{limit: limit, sort: {date: -1}});
});

Meteor.publish('online', function(urlVar){
	return Online.find({url: urlVar});
});

Meteor.publish("members", function() {
	return Members.find({});
});

// only for the chrome extension
Meteor.publish('onlineCount', function(urlVar){
	return Online.find({url: urlVar}).count();
});