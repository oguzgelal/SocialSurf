Meteor.startup(function() {

  if (Rooms.find({}).count() == 0){
    Meteor.call("bootstrap");
  }

  // TODO: not working
  Rooms.update({}, {$set: {online: 0}});

});
