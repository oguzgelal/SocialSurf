Meteor.methods({

  // Add connected client to the Online collection.
  // idle : if idle is set to true, the connection is being made
  // from an injected script working on the background. The actual
  // chat page is not being viewed. If idle is set to false (means online)
  // the chat page is being viewed.

  clientJoin: function(clientID, urlVar, idle){
    // prevent duplicate
    var occurance = Online.find({client: clientID}).count();
    if (occurance == 0){
      Online.insert({
        client: clientID,
        url: urlVar,
        idle: true
      }, function(err){
        if (err) throw err;
        console.log("client joined...");
      });
    }
  },
  // Remove disconnected client from the Online collection
  clientLeave: function(clientID){
    Online.remove({client: clientID}, function(err){
      if (err) throw err;
      console.log("client removed from online...");
    });
  },
  // Get how many clients are connected to an URL
  getOnlineCount: function(urlVar){
    return Online.find({url: urlVar}).count();
  }
});
