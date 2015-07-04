Meteor.methods({
  checkApp: function(urlRaw, appID, token){
    var url = Meteor.call("cleanURL", urlRaw);
    var valid = true;

    // TODO : do this from the database
    var apps = {}; 
    apps["EYhO79iz2o"] = {
      type: "official",
      name: "SocialSurf Chrome App"
    }
    //-------------------

    if (apps[appID]){
      var currentApp = apps[appID]
      if (currentApp.type==="official"){ valid=false; }
      else{
        //check the permissions of 'currentApp'
      }
    }
    else{ valid = false; }
    
    if (token){
      var getToken = Tokens.find({appID: appID, token: token, url: url});
      if (getToken.count() > 0){
        var date = new Date();  
        var dateNow = date.getTime();

        var currentToken = getToken.fetch()[0];
        var dateExpire = currentToken.expiration;
        var tokenExpired = dateNow >= dateExpire;
        /* ...add new rules... */
        valid = !tokenExpired;
        
      }
    }
    // TODO : implement this...
    // var appsRec = Apps.find({appID: appID});
    // if (appsRec.count() > 0){

    //}

    //return valid;
    return true;
  },

  // called from browser extension's ddp connection
  requestToken: function(appID, urlRaw){
    var appConnectionID = this.connection.id;
    /********************************/
    /*** Blocked connections here ***/
    /********************************/
    var url = Meteor.call("cleanURL", urlRaw);
    var token = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i<10; i++){
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    var nowDate = new Date();
    var validFor = 60000; // 1 minute
    var expiration = nowDate.getTime()+validFor;

    Tokens.insert({
      appID: appID,
      token: token,
      expiration: expiration,
      url: url,
      appConnectionID: appConnectionID
    },
    function(err){
      if (err){ throw err; }
      console.log("Token ("+token+") from app("+appID+") through app connection with ID ("+appConnectionID+") added...");
    });

    return token;
  }

});