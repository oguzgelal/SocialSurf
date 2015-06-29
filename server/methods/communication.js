Meteor.methods({
  clientJoin: function(urlVar){
    var connectionID = this.connection.id;
    var connUserID = this.userId;
    var connUserIP = this.connection.clientAddress;
    var connHeaders = this.connection.httpHeaders;
    /********************************/
    /*** Blocked connections here ***/
    /********************************/
    console.log("Connection ID : "+connectionID);
    console.log("Connected User ID : "+connUserID);
    console.log("Connected User IP : "+connUserIP);
    console.log("Connected User Headers : "+connHeaders);

    var occurance = Online.find({client: connectionID}).count();
    // prevent duplicate
    if (occurance == 0){
      Online.insert({
        client: connectionID,
        url: urlVar,
        userID: connUserID,
        userIP: connUserIP,
        headers: connHeaders
      },
      function(err){
        if (err) throw err;
        console.log("Client joined...");
      });
    }
    return true;
  },
  // Remove disconnected client from the Online collection
  clientLeave: function(connectionID){
    Online.remove({client: connectionID}, function(err){
      if (err) throw err;
      console.log("Client removed from online...");
      return true;
    });
  },
  // Get how many clients are connected to an URL
  getOnlineCount: function(urlVar){
    return Online.find({url: urlVar}).count();
  }
});
