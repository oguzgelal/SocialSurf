Meteor.publish('rooms', function(){
  return Rooms.find({});
});
