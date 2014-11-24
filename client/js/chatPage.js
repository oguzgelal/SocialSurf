Meteor.startup(function(){

});

Template.chatPage.helpers({
  urls: function(){
    return Rooms.find({});
  },
  messages: function(){
    return Messages.find({});
  }
});

Template.chatPage.events({
  "click .sendMessage": function(event, template){
    var ths = this;
    var message = $('.message')[0].value;
    Meteor.call("addMessage", ths._id, "userid", message, function(){
      console.log("message ["+message+"] is sent to room ("+ths._id+")");
    });
  }
});
