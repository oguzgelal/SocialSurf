Meteor.methods({
  bootstrap: function(){
    console.log("bootstrap...");
    Rooms.insert({ url: "www.google.com" });
    Rooms.insert({ url: "www.youtube.com" });
    Rooms.insert({ url: "www.facebook.com" });
  },
  checkRoom: function(url){
    return Rooms.findOne({url: url});
  },
  clearRooms: function(){
    Rooms.remove({});
  },
  getRoomCnt: function(){
    return Rooms.find({}).count();
  }
});
