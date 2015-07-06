Router.map(function(){

  // browser pull
  this.route('frame', {
    path: '/frame/:url/:aid/:token/',
    data: function(){
      var urlRaw = decodeURIComponent(this.params.url);
      var url = Domain.cleanURL(urlRaw);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');

      var appID = thisRouter.params.aid;
      var token = thisRouter.params.token;
      var urlRaw = decodeURIComponent(thisRouter.params.url);
      var url = Domain.cleanURL(urlRaw);
      // check if app is registered and able to load the content
      Meteor.call('checkApp', url, appID, token, function(err, available){
        if (available){
          prepareEnv(url, function(){ thisRouter.render(); });
        }
        else{
          thisRouter.render('blocked');
          console.log("SocialSurf: Connection blocked.");
        }
      });
    }
  });

  this.route('landing', {
    path: '/',
    data: function(){
      return Rooms.findOne({url: "socialsurf.io"});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');
      prepareEnv("socialsurf.io", function(){ thisRouter.render(); });
    }
  });


  // Temporary URL to be removed !!! (bypasses the security checks)
  this.route('temp', {
    path: '/temp/:url/',
    data: function(){
      var urlRaw = decodeURIComponent(this.params.url);
      var url = Domain.cleanURL(urlRaw);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');
      var urlRaw = decodeURIComponent(thisRouter.params.url);
      var url = Domain.cleanURL(urlRaw);
      prepareEnv(url, function(){ thisRouter.render('frame'); });
    }
  });


});



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
