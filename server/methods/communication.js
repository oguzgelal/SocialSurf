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
        popup: "",
        url: urlVar,
        idle: idle
      }, function(err){
        if (err) throw err;
        console.log("Client joined...");
      });
    }
  },
  // Remove disconnected client from the Online collection
  clientLeave: function(clientID){
    var isPopup = Online.find({popup: clientID}).count();
    if (isPopup > 0){
      Online.update({popup: clientID}, {$set : {idle: true, popup: ""}});
      console.log("Popup closed. State changed...");
    }
    else{
      Online.remove({client: clientID}, function(err){
        if (err) throw err;
        console.log("Client removed from online...");
      });
    }
  },
  // Updates the online status from idle to online
  // Popup ID is the id of the popup  window that the window is being
  // viewed from. The purpose of keeping this is to detect when
  // the popup window closes so that status could be switched from
  // online to idle
  changeStateToOnline: function(urlVar, sessionID, popupID){
    Online.update({url: urlVar, client: sessionID}, {$set : {idle: false, popup: popupID}});
  },
  // Get how many clients are connected to an URL
  getOnlineCount: function(urlVar){
    return Online.find({url: urlVar}).count();
  }
});
