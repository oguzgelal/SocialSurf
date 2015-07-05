Router.map(function(){

  // browser pull
  this.route('frame', {
    path: '/frame/:url/',
    data: function(){
      var urlRaw = decodeURIComponent(this.params.url);
      var url = Domain.cleanURL(urlRaw);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');

      var appID = thisRouter.params.query.aid;
      var token = thisRouter.params.query.token;
      var urlRaw = decodeURIComponent(thisRouter.params.url);
      var url = Domain.cleanURL(urlRaw);
      // check if app is registered and able to load the content
      Meteor.call('checkApp', url, appID, token, function(err, available){
        if (available){
          Session.set("currentURL", url);
          Meteor.call('clientJoin', url, function(){
            Meteor.call('addCheckRoom', url, function(){
              Meteor.subscribe('members', function(){
                Meteor.subscribe('rooms', url, function(){
                  Meteor.subscribe('online', url, function(){
                    thisRouter.render();
                  });
                });
              });
            });
          });
        }
        else{
          thisRouter.render('blocked');
          console.log("SocialSurf: Connection blocked.");
        }
      });

    }
  });

/* static pages */

this.route('landing', {
  path: '/',
  data: function(){
    var url = "socialsurf.io";
    return Rooms.findOne({url: url});
  },
  action: function(){
    var thisRouter = this;
    thisRouter.render('loading');
    var url = "socialsurf.io";
    Session.set("currentURL", url);
    Meteor.call('clientJoin', url, function(){
      Meteor.call('addCheckRoom', url, function(){
        Meteor.subscribe('members', function(){
          Meteor.subscribe('rooms', url, function(){
            Meteor.subscribe('online', url, function(){
              thisRouter.render();
            });
          });
        });
      });
    });
  }
});


});
