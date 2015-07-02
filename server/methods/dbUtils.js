Meteor.methods({
  addCheckRoom: function(url){
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({
        url: url,
        online: 0
      });
    }
  },
  addMessage: function(roomid, message, nick, user){
    Messages.insert({
      roomid: roomid,
      nick: nick,
      user: user,
      message: message,
      date: new Date()
    });
  },
  getOldMessages: function(roomid, limit, skip){
    var res = Messages.find({roomid: roomid},{limit: limit, skip: skip, sort: {date: -1}}).fetch();
    return res;
  }
});
