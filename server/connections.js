Meteor.onConnection(function(conn){
  console.log("Client ["+conn.id+"] Connected...");


  // Client join is allways handled by the clients once connected.
  // Client leave is handled by the server because the clients might
  // quit and disconnect unexpectedly.

  conn.onClose(function(){
    Meteor.call("clientLeave", conn.id, function(){
      console.log("Client ["+conn.id+"] Gone...");
    });

    conn.close();
    console.log("Client ["+conn.id+"] Disconnected...");

  });

});
