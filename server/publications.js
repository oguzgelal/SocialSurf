Meteor.publish('rooms', function(url){
  return Rooms.find({url: url});
});
Meteor.publish('messages', function(roomid){
  return Messages.find({roomid: roomid});
});
