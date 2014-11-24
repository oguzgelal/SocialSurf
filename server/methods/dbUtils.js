Meteor.methods({
  addCheckRoom: function(url){
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({url: url});
    }
  },
  addMessage: function(roomid, userid, message){
    Messages.insert({
      roomid: roomid,
      userid: userid,
      message: message
    });
  }
});
