Meteor.methods({
  // Add connected client to the Online collection
  clientJoin: function(clientID, urlVar){
    // prevent duplicate
    var occurance = Online.find({client: clientID}).count();
    if (occurance == 0){
      Online.insert({
        client: clientID,
        url: urlVar
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
