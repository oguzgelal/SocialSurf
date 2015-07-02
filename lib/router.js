Router.map(function(){

  // browser pull
  this.route('frame', {
    path: '/frame/:url/',
    data: function(){
      var url = decodeURIComponent(this.params.url);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');
      
      var urlRaw = decodeURIComponent(this.params.url);
      var url = Domain.cleanURL(urlRaw);
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
