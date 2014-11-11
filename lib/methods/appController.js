Meteor.methods({
  pushStartRoom: function(){
    var current = Session.get("currentUrl");
    if (current && !Rooms.findOne({url: current})){
        Rooms.insert({url: current});
        console.log("Room "+current+" created...");
    }
  }
});
