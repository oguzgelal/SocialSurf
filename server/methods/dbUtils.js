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
  },
  joinRoom: function(urlVar){
    urlVar = decodeURIComponent(urlVar);
    Rooms.update({url: urlVar}, {$inc: {online: 1}}
    );
  },
  leaveRoom: function(urlVar){
    urlVar = decodeURIComponent(urlVar);
    Rooms.update({url: urlVar}, {$inc: {online: -1}});
  },
  getOnlineCount: function(urlVar){
    // TODO : Cannot read property 'online' of undefined
    var found = Rooms.findOne({url: urlVar});
    if (found){
      return found.online;
    }
    return -1;

  }
});
