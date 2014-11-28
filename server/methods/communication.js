Meteor.methods({
  // TODO : new collection for handle online counts
  clientConnected: function(clientID, urlVar){
    console.log("joining ["+clientID+"] to "+urlVar+"...");
  },
  clientDisconnect: function(clientID){
    console.log("["+clientID+"] leaving...");
  }
});
