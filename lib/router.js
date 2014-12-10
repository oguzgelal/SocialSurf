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

      // This page is opened through the popup - change idle to online
      if (sessionID){
        var popupID = Meteor.connection._lastSessionId;
        console.log("Session ID (From Extension) : "+sessionID);
        console.log("Popup ID (From Extension) : "+popupID);
        Meteor.call("changeStateToOnline", url, sessionID, popupID);
      }
      // This page is opened directly from browser - add new online
      else {
        console.log("Standalone Page : "+Meteor.connection._lastSessionId);
        Meteor.call("clientJoin", Meteor.connection._lastSessionId, url, false);
      }


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
