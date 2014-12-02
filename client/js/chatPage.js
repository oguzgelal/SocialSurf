Meteor.startup(function(){
  $(window).resize(function(event) {
    console.log("yis");
    setMessageAreaHeight();
  });
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
  setMessageAreaHeight();
}

Template.chatPage.events({
  // SETTINGS BAR EVENTS ------------------------------------
  "focus .settingsNick": function(event, template){
    $(".settingsNick").select();
  },
  "mouseup .settingsNick": function(event, template){
    event.preventDefault();
  },
  "click .setNick": function(event, template){
    var nick = $('.settingsNick').val();
    setNickname(nick);
  },
  "keypress .settingsNick": function(event, template){
    if (event.which == 13) {
      var nick = $('.settingsNick').val();
      setNickname(nick);
    }
  },
  "mouseenter .settingsBarToggle": function(event, template){
    settingsBarAnimate("down");
  },
  "mouseleave .settingsBarToggle": function(event, template){
    settingsBarAnimate("up");
  },
  "click .settingsBarToggle": function(event, template){
    settingsBarToggle();
  },
  // MESSAGE AREA EVENTS ------------------------------------
  "resize window": function(event, template){

  },
  // MESSAGE EVENTS -----------------------------------------
  "click .sendMessage": function(event, template){
    var ths = this;
    var message = $('.message')[0].value;

    //Meteor.call("addMessage", ths._id, nick, message, function(){
    //  console.log("message ["+message+"] is sent to room ("+ths._id+")");
    //});
  },
  "keydown .messageInputText": function(event, template){
    var ths = this;
    if (event.keyCode == 13 && !event.shiftKey){
      event.preventDefault();
      var msg = $('.messageInputText').val();
      $('.messageInputText').val("");
      sendMessage(ths, msg);
      return false;
    }
  }
});

// Slight move of the settingsBarLine and settingsBarToggle
function settingsBarAnimate(str){
  if (str == "down" && !isSettingBarOpen()){
    $('.settingsBarToggle').css("padding-top", "17px");
    $('.settingsBarLine').height(12);
  }
  else if (str == "up" && !isSettingBarOpen()){
    $('.settingsBarToggle').css("padding-top", "10px");
    $('.settingsBarLine').height(10);
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
      $('.settingsBarToggle').css('background-color', 'transparent');
    });
  }
  else if (str == "settings"){
    $('.settingsBarToggle .closeIcon').hide(0, function(){
      $('.settingsBarToggle .settingsIcon').show('fast');
      $('.settingsBarToggle').css('background-color', '#402060');
    });
  }
}

// Set nickname and store it to persistent session var
function setNickname(str){
  amplify.store("nickname", str);
  setSettingsBarState("close");
}

// Send the message
function sendMessage(ths, message){
  var nick = amplify.store("nickname");
  Meteor.call("addMessage", ths._id, nick, message, function(){
    console.log("message ["+message+"] is sent to room ("+ths._id+")");
  });
}

// Sets the message area to fill the available height
function setMessageAreaHeight(){
  var height = $(window).height();
  var overflow = $('.messageInput').height() + $('.onlineData').height() + 2; // 2 for borders
  if (!overflow){
    overflow = 103;
  }
  $('.messageArea').height(height-overflow);
}
