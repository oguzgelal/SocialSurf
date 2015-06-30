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
      var limit = 100;

      Meteor.call('clientJoin', url, function(){
        Meteor.call('addCheckRoom', url, function(){
          Meteor.subscribe('members', function(){
            Meteor.subscribe('rooms', url, function(){
              Meteor.subscribe('online', url, function(){
                var room = Rooms.findOne({url: url});
                Meteor.subscribe('messages', room._id, limit, 0, function(){
                  thisRouter.render();
                });
              });
            });
          });
        });
      });
    }

  });
});
