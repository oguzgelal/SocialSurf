Meteor.methods({
  // Allways called from own client (router). Connection ID belongs to the frame.
  clientJoin: function(urlRaw){
    urlRaw = decodeURIComponent(urlRaw);
    var urlVar = Meteor.call("cleanURL", urlRaw);
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
  // Called when any connection is lost. connectionID could belong to frame
  // or to the browser extension's ddp connection.
  clientLeave: function(connectionID){
    // connectionID belongs to browser extension's ddp connection.
    Tokens.remove({appConnectionID: connectionID}, function(err){
      if (err) throw err;
      console.log("Token removed...");
    });
    // connectionID belongs to connection from own client (frame)
    Online.remove({client: connectionID}, function(err){
      if (err) throw err;
      console.log("Client removed from online...");
    });
    return true;
  },
  // Get how many clients are connected to an URL
  getOnlineCount: function(urlRaw){
    urlRaw = decodeURIComponent(urlRaw);
    var urlVar = Meteor.call("cleanURL", urlRaw);
    return Online.find({url: urlVar}).count();
  }
});
