
Router.map(function(){

  this.route('chatPage', {
    path: '/chat/:url',
    data: function(){
      var url = decodeURIComponent(this.params.url);
      return Rooms.findOne({url: url});
    },
    action: function(){
      var thisRouter = this;
      thisRouter.render('loading');
      var url = decodeURIComponent(this.params.url);
      Meteor.subscribe('rooms', url, function(){
        Meteor.call('addCheckRoom', url, function(){
          var room = Rooms.findOne({url: url});
          Meteor.subscribe('messages', room._id, function(){
            thisRouter.render();
          });
        });
      });
    }
  });

});
