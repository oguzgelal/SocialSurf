Router.configure({ notFoundTemplate: "notfound" });

Router.map(function(){

  // browser pull
  this.route('frame', {
    path: '/frame/',
    data: function(){
      var urlReceived = this.params.query.url;
      urlReceived=ironRouterBugFix(urlReceived);
      var urlRaw = decodeURIComponent(urlReceived);
      var url = Domain.cleanURL(urlRaw);
      return {
        room: Rooms.findOne({url: url}),
        showFeedback: true,
        showContact: false
      };
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');

      var appID = thisRouter.params.query.aid;
      var token = thisRouter.params.query.token;
      var urlReceived = thisRouter.params.query.url;
      urlReceived=ironRouterBugFix(urlReceived);
      var urlRaw = decodeURIComponent(urlReceived);
      var url = Domain.cleanURL(urlRaw);

      mixpanel.track("Frame Initialized", {
        "appID": appID,
        "token": token,
        "urlRaw": urlRaw,
        "urlClean": url
      });

      // check if app is registered and able to load the content
      Meteor.call('checkApp', url, appID, token, function(err, available){
        if (available){
          prepareEnv(url, function(){ thisRouter.render(); });
        }
        else{
          thisRouter.render('blocked');
          console.log("socialsurf : Connection blocked.");
        }
      });
    }
  });

this.route('landing', {
  path: '/',
  data: function(){
    return {
      room: Rooms.findOne({url: "socialsurf.io"}),
      showFeedback: false,
      showContact: false
    };
  },
  action: function(){
    var thisRouter = this;
    thisRouter.render('loading');
    prepareEnv("socialsurf.io", function(){ thisRouter.render(); });
  }
});
this.route('feedback', {
  path: '/feedback/',
  data: function(){
    return {
      room: Rooms.findOne({url: "socialsurf.io/feedback"}),
      showFeedback: false,
      showContact: true
    };
  },
  action: function(){
    var thisRouter = this;
    thisRouter.render('loading');
    prepareEnv("socialsurf.io/feedback", function(){ thisRouter.render('frame'); });
  }
});


  // Temporary URL to be removed !!! (bypasses the security checks)
  this.route('temp', {
    path: '/temp/:url/',
    data: function(){
      var urlReceived = this.params.url;
      urlReceived=ironRouterBugFix(urlReceived);
      var urlRaw = decodeURIComponent(urlReceived);
      var url = Domain.cleanURL(urlRaw);
      return {
        room: Rooms.findOne({url: url}),
        showFeedback: true,
        showContact: true
      };
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');
      
      var urlReceived = thisRouter.params.url;
      urlReceived=ironRouterBugFix(urlReceived);
      var urlRaw = decodeURIComponent(urlReceived);
      var url = Domain.cleanURL(urlRaw);
      prepareEnv(url, function(){ thisRouter.render('frame'); });
    }
  });


});

// NOTICE: Due to a bug in iron-router, '+' signs are replaced with a space.
// Untill the bug is fixed, this method below will serve as a workaround. 
function ironRouterBugFix(url){
  return url.replace(/ /g,"+");
}

function prepareEnv(url, fn){
  Session.set("currentURL", url);
  Meteor.call('clientJoin', url, function(){
    Meteor.call('addCheckRoom', url, function(){
      Meteor.subscribe('members', function(){
        Meteor.subscribe('rooms', url, function(){
          Meteor.subscribe('online', url, function(){
            fn();
          });
        });
      });
    });
  });
}
