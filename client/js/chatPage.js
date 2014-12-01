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

// Move the settings bar upside of the screen according to its height
Template.chatPage.rendered = function() {
  var h = $('.settingsBar').height();
  $('.settingsBar').css("margin-top", -h+"px");
}

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
    settingsBarAnimate("down");
  },
  "mouseleave .settingsBarToggle": function(event, template){
    settingsBarAnimate("up");
  },
  "click .settingsBarToggle": function(event, template){
    settingsBarToggle();
  }
});

// Slight move of the settingsBarLine and settingsBarToggle
function settingsBarAnimate(str){
  if (str == "down" && !isSettingBarOpen()){
    $('.settingsBarToggle').css("padding-top", "17px");
    $('.settingsBarLine').height(10);
  }
  else if (str == "up" && !isSettingBarOpen()){
    $('.settingsBarToggle').css("padding-top", "10px");
    $('.settingsBarLine').height(7);
  }
}

// Toggle settingsBar
function settingsBarToggle(){
  if (isSettingBarOpen()){ setSettingsBarState("close"); }
    else{ setSettingsBarState("open");
  }
}

// Open or Close the settingsBar
function setSettingsBarState(str){
  if (str == "open" && !isSettingBarOpen()){
    toggleSettingsBarIconTo("close");
    $('.settingsBar').addClass('active');
    $('.settingsBarLine').fadeOut('fast');
    $('.settingsBar').css("margin-top", "0px");
  }
  else if (str == "close" && isSettingBarOpen()){
    toggleSettingsBarIconTo("settings");
    $('.settingsBar').removeClass('active');
    $('.settingsBarLine').show();
    var h = $('.settingsBar').height();
    $('.settingsBar').css("margin-top", -h+"px");
  }
}

// Returns true if settingsBar is open
function isSettingBarOpen(){
  return $('.settingsBar').hasClass('active');
}

// Toggle the settingsBarToggle icon to settings or close icons
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
