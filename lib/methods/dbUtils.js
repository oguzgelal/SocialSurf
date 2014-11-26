Meteor.methods({
  bootstrap: function(){
    console.log("bootstrap...");
    Rooms.insert({ url: "www.google.com" });
    Rooms.insert({ url: "www.youtube.com" });
    Rooms.insert({ url: "www.facebook.com" });
  }
});
