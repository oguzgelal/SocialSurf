Router.map(function(){

  this.route('chatPage', {
    path: '/chat/:url/:sessionID?',
    data: function(){
      var url = decodeURIComponent(this.params.url);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var url = decodeURIComponent(this.params.url);
      var sessionID = this.params.sessionID;
      Session.set("sessionID", sessionID);
      this.render('loading');
      var thisRouter = this;
      Meteor.call('addCheckRoom', url, function(){
        Meteor.subscribe('rooms', url, function(){
          Meteor.subscribe('online', url, function(){
            var room = Rooms.findOne({url: url});
            Meteor.subscribe('messages', room._id, function(){
              thisRouter.render();
            });
          });
        });
      });
    }
  });


});
