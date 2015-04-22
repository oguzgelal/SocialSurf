// Fires when a user logs in for the first time
Accounts.onCreateUser(function (options, user){
  console.log("***********");
  user.profile = options.profile || {};
      // user didnt connect with a different service before
      if (Members.find({id: user._id}).count()==0){
        var insertOpts = {
          _id: user._id,
          name: user.profile.name
        };

        console.log(user.services);
        console.log(user);
        console.log(user.profile);

        if (user.services.facebook){
          insertOpts.avatar = "http://graph.facebook.com/"+user.services.facebook.id+"/picture";
          user.avatar = "http://graph.facebook.com/"+user.services.facebook.id+"/picture";
          insertOpts.email = user.services.facebook.email;
          user.email = user.services.facebook.email;
          insertOpts.profileLink = user.services.facebook.link;
          user.profileLink = user.services.facebook.link;
          insertOpts.facebook_id = user.services.facebook.id;
          user.facebook_id = user.services.facebook.id;
        }
        // twitter does not provide email addresses
        else if (user.services.twitter){
          insertOpts.avatar = user.services.twitter.profile_image_url;
          user.avatar = user.services.twitter.profile_image_url;
          insertOpts.profileLink = "http://twitter.com/"+user.services.twitter.screenName;
          user.profileLink = "http://twitter.com/"+user.services.twitter.screenName;
          insertOpts.twitter_id = user.services.twitter.id;
          user.twitter_id = user.services.twitter.id;
        }
        else if (user.services.google){
          insertOpts.avatar = user.services.google.picture;
          user.avatar = user.services.google.picture;
          insertOpts.email = user.services.google.email;
          user.email = user.services.google.email;
          insertOpts.profileLink = "https://plus.google.com/"+user.services.google.id;
          user.profileLink = "https://plus.google.com/"+user.services.google.id;
          insertOpts.twitter_id = user.services.google.id;
          user.twitter_id = user.services.google.id;
        }

        Members.insert(insertOpts);
      }

      return user;
    });

// user logs in
Accounts.onLogin(function(options){
  var loggedin = options.user;
  console.log("Welcome, "+loggedin.profile.name);
});