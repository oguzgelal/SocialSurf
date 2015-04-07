// Fires when a user logs in for the first time
Accounts.onCreateUser(function (options, user){
  user.profile = options.profile || {};
      // user didnt connect with a different service before
      if (Members.find({id: user._id}).count()==0){
        var insertOpts = {
          _id: user._id,
          name: user.profile.name
        };

        if (user.services.facebook){
          insertOpts.avatar = "http://graph.facebook.com/"+user.services.facebook.id+"/picture";
          insertOpts.email = user.services.facebook.email;
          insertOpts.profileLink = user.services.facebook.link;
          insertOpts.facebook_id = user.services.facebook.id;
        }

        Members.insert(insertOpts);
      }
      else{
      // ---- FUTURE STEP ---- //
      // TODO : TEST THIS - will this be fired if user connects another service while logged in ?
      // user found in the database
      // probably registered with another service
      if (user.services.facebook){
        Members.update(user._id, {$set: {'facebook_id': loggedin.services.facebook.id}});
      }
    }

    return user;
  });

// user logs in
Accounts.onLogin(function(options){
  var loggedin = options.user;
  console.log("Welcome, "+loggedin.profile.name);
});