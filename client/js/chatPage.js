Meteor.startup(function(){

});

Template.chatPage.helpers({
  urls: function(){
    return Rooms.find({});
  },
  messages: function(){
    return Messages.find({});
  },
  nickname: function(){
    return amplify.store("nickname");
  }
});

Template.chatPage.events({
  "click .sendMessage": function(event, template){
    var ths = this;
    var message = $('.message')[0].value;
    var nick = amplify.store("nickname");
    Meteor.call("addMessage", ths._id, nick, message, function(){
      console.log("message ["+message+"] is sent to room ("+ths._id+")");
    });
  }
});
