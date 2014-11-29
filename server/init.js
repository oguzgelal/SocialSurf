Meteor.startup(function() {

  // If no data present, add initial rooms
  if (Rooms.find({}).count() == 0){
    Meteor.call("bootstrap");
  }

  // Reset online counts on server startup
  Online.remove({});

  // TODO : Wake up call after server refresh
  
});
