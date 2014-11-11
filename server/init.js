Meteor.startup(function() {
  if (Rooms.find({}).count() == 0){
    Meteor.call("bootstrap");
  }
});
