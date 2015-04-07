Meteor.methods({

  clientJoin: function(clientID, urlVar){
    var occurance = Online.find({client: clientID}).count();
    // prevent duplicate
    if (occurance == 0){
      Online.insert({
        client: clientID,
        url: urlVar
      }, function(err){
        if (err) throw err;
        console.log("Client joined...");
      });
    }
    return true;
  },
  // Remove disconnected client from the Online collection
  clientLeave: function(clientID){
    Online.remove({client: clientID}, function(err){
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
