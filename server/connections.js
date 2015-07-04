Meteor.onConnection(function(conn){
  var clientID = conn.id;
  var clientIP = conn.clientAddress;
  var clientHeaders = conn.httpHeaders;

  conn.onClose(function(){
    Meteor.call("clientLeave", conn.id, function(){
      console.log("Client ["+conn.id+"] Gone...");
    });
    conn.close();
    console.log("Client ["+conn.id+"] Disconnected...");
  });

});