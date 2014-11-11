Meteor.methods({
  bootstrap: function(){
    console.log("bootstrap...");
    Rooms.insert({ url: "http://www.google.com" });
    Rooms.insert({ url: "http://www.youtube.com" });
    Rooms.insert({ url: "http://www.facebook.com" });
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
