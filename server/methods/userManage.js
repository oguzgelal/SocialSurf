// Fires when a user logs in for the first time
Accounts.onCreateUser(function (options, user){
  user.profile = options.profile || {};

  if (Members.find({id: user._id}).count()==0){
    var insertOpts = {
      _id: user._id,
      name: user.profile.name
    };

    //console.log(user.services);
    //console.log(user);
    //console.log(user.profile);

    if (user.services.facebook){
      insertOpts.avatar = "https://graph.facebook.com/"+user.services.facebook.id+"/picture";
      user.avatar = "https://graph.facebook.com/"+user.services.facebook.id+"/picture";
      insertOpts.email = user.services.facebook.email;
      user.email = user.services.facebook.email;
      insertOpts.profileLink = user.services.facebook.link;
      user.profileLink = user.services.facebook.link;
      insertOpts.facebook_id = user.services.facebook.id;
      user.facebook_id = user.services.facebook.id;
    }
    else if (user.services.twitter){
      insertOpts.avatar = user.services.twitter.profile_image_url;
      user.avatar = user.services.twitter.profile_image_url;
      insertOpts.profileLink = "https://twitter.com/"+user.services.twitter.screenName;
      user.profileLink = "https://twitter.com/"+user.services.twitter.screenName;
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