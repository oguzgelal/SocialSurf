Meteor.publish('rooms', function(url){
  return Rooms.find({url: url});
});

Meteor.publish('messages', function(roomid){
  return Messages.find({roomid: roomid});
});

Meteor.onConnection(function(conn){
  console.log("Client ["+conn.id+"] Connected...");
  conn.onClose(function(){
    console.log("Client ["+conn.id+"] Disconnected...");
    conn.close();
  });
});
