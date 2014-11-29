Meteor.methods({
  addCheckRoom: function(url){
    url = decodeURIComponent(url);
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({
        url: url,
        online: 0
      });
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
