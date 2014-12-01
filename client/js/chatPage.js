Meteor.startup(function(){

});

Template.chatPage.helpers({
  messages: function(){
    return Messages.find({});
  },
  nickname: function(){
    return amplify.store("nickname");
  },
  online: function(){
    return Online.find().count();
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
  },

  "mouseenter .settingsBarToggle": function(event, template){
    if (!$('.settingsBar').hasClass('active')){
      $('.settingsBarToggle').css("padding-top", "15px");
      $('.settingsBar').css("top", "-42%");
    }
    else{
      $('.settingsBar').css("top", "-5px");
      var toggleTop = $('.settingsBarToggle').css("top");
      $('.settingsBarToggle').css("margin-top", "-5px");
      $('.settingsBarToggle').css("padding-top", "5px");
    }
  },
  "mouseleave .settingsBarToggle": function(event, template){
    if (!$('.settingsBar').hasClass('active')){
      $('.settingsBarToggle').css("padding-top", "10px");
      $('.settingsBar').css("top", "-44%");
    }
    else{
      $('.settingsBar').css("top", "0");
      $('.settingsBarToggle').css("margin-top", "0");
      $('.settingsBarToggle').css("padding-top", "10px");
    }
  },
  "click .settingsBarToggle": function(event, template){
    $('.settingsBarToggle').css("margin-top", "0");
    if (!$('.settingsBar').hasClass('active')){
      toggleSettingsBarIconTo("close");
      $('.settingsBar').addClass('active');
      var settingsBarHeight = $('.settingsBar').height();
      $('.settingsBarToggle').css("top", settingsBarHeight+"px");
      $('.settingsBar').css("top", "0");
    }
    else{
      toggleSettingsBarIconTo("settings");
      $('.settingsBar').removeClass('active');
      $('.settingsBar').css("top", "-44%");
      $('.settingsBarToggle').css("top", "0");
    }

  }
});

function toggleSettingsBarIconTo(str){
  if (str == "close"){
    $('.settingsBarToggle .settingsIcon').hide(0, function(){
      $('.settingsBarToggle .closeIcon').show('fast');
    });
  }
  else if (str == "settings"){
    $('.settingsBarToggle .closeIcon').hide(0, function(){
      $('.settingsBarToggle .settingsIcon').show('fast');
    });
  }
}
