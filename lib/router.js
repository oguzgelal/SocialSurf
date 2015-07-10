Router.configure({ notFoundTemplate: "notfound" });

Router.onBeforeAction(function() {
  if (Meteor.user()){ amplitude.setUserId(Meteor.user()._id); }
  this.next();
});

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

      amplitude.logEvent("Frame Initialized", {
        "appID": appID,
        "urlRaw": urlRaw,
        "urlClean": url
      });

      // check if app is registered and able to load the content
      Meteor.call('checkApp', url, appID, token, function(err, available){
        if (available){
          GAnalytics.pageview("/"+url);
          prepareEnv(url, function(){ thisRouter.render(); });
        }
        else{
          GAnalytics.pageview("/blocked");
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
    amplitude.logEvent("Landing Page Initialized");
    GAnalytics.event("Landing Page Initialized");
    prepareEnv("socialsurf.io", function(){
      GAnalytics.pageview();
      thisRouter.render();
    });
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
    amplitude.logEvent("Feedback Page Initialized");
    GAnalytics.event("Feedback Page Initialized");
    prepareEnv("socialsurf.io/feedback", function(){
      GAnalytics.pageview("/feedback");
      thisRouter.render('frame');
    });
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
      prepareEnv(url, function(){
        GAnalytics.pageview("/temp/"+url);
        thisRouter.render('frame');
      });
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
