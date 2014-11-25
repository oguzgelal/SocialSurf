Meteor.methods({
  addCheckRoom: function(url){
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({url: url});
    }
  },
  addMessage: function(roomid, nick, message){
    Messages.insert({
      roomid: roomid,
      nick: nick,
      message: message,
      date: new Date()
    });
  }
});
