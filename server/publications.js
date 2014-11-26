Meteor.publish('rooms', function(url){

  /*
  // Client Connected
  console.log("Client Connected...");
  Rooms.update({url: url}, {$inc: {online: 1}});
  if(this._session.socket._events.data.length === 1) {
  console.log(this);
  this._session.socket.on("close", Meteor.bindEnvironment(function() {
  // Client Disconnected
  console.log("Client Disconnected...");
  Rooms.update({url: url}, {$inc: {online: -1}});
},
function(e) {
console.log("Connection Close Error : ", e);
}));
}
*/
return Rooms.find({url: url});
});

//Meteor.publish('onlineStats', function(url){
//  return OnlineStats.find({url: url});
//});

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
