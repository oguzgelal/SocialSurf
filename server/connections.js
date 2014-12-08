Meteor.onConnection(function(conn){
  console.log("Client ["+conn.id+"] Connected...");

  conn.onClose(function(){
    Meteor.call("clientLeave", conn.id, function(){
      console.log("Client ["+conn.id+"] Gone...");
    });

    console.log("Client ["+conn.id+"] Disconnected...");
    conn.close();
  });

});
