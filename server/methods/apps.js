Meteor.methods({
  checkApp: function(urlRaw, appID, token){
    var url = Meteor.call("cleanURL", urlRaw);
    var valid = true;
    var app = Apps.find({appID: "EYhO79iz2o"}).fetch()[0];

    if (app){
      // official apps needs a token because they are allowed on every domain.
      if (app.type==="official"){ valid=false; }
      else{
        //check the permissions of 'app'
        valid = false;
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

    return valid;
  },

  // called from browser extension's ddp connection
  requestToken: function(appID, urlRaw){
    var appConnectionID = this.connection.id;
    /**********************************/
    /*** Block app connections here ***/
    /**********************************/
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