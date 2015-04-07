Meteor.startup(function() {

  $(window).resize(function(event) {
    setMessageAreaHeight();
  });

  Meteor.setInterval(function(){
    Session.set('time', new Date);
  }, 1000);

});

Template.frame.helpers({
  messages: function() {
    return Messages.find({},{sort:{date:1}});
  },
  nickname: function() {
    return amplify.store("nickname");
  },
  online: function() {
    return Online.find().count();
  },
  getFirstName: function(){
    if (Meteor.user() && Meteor.user().services){
      if (Meteor.user().services.facebook){ return Meteor.user().services.facebook.name; }  
    }
  }
});

Template.messageBox.helpers({
  timePassed: function(date){
    var now = Session.get('time') || new Date;
    // time passed in ms
    var diff = now.getTime() - date.getTime();
    return millisecondsToStr(diff);
  }
});

Template.messageBox.rendered = function(){
  $('.messageScrollable').scrollTop($('.messageArea').prop("scrollHeight"));
}

Template.frame.rendered = function() {
  // Move the settings bar upside of the screen according to its height
  var h = $('.settingsBar').height();
  $('.settingsBar').css("margin-top", -h + "px");
  setMessageAreaHeight();
  $('.messageScrollable').scrollTop($('.messageArea').prop("scrollHeight"));

  if (Meteor.user()){
    Meteor.subscribe('userData', Meteor.user()._id, function(data){
      console.log(data);
    });
  }
}

Template.frame.events({
  // SETTINGS BAR EVENTS ------------------------------------
  "mouseenter .btn-social": function(event, template){
    var target = event.currentTarget;
    var currectContent = $(target).html();
    $(target).html(currectContent+" Login");
  },
  "mouseleave .btn-facebook": function(event, template){ $(event.currentTarget).html("<i class='fa fa-facebook'></i>"); },
  "mouseleave .btn-twitter": function(event, template){ $(event.currentTarget).html("<i class='fa fa-twitter'></i>"); },
  "mouseleave .btn-google": function(event, template){ $(event.currentTarget).html("<i class='fa fa-google-plus'></i>"); },
  "mouseleave .btn-github": function(event, template){ $(event.currentTarget).html("<i class='fa fa-github'></i>"); },
  "focus .settingsNick": function(event, template) {
    $(".settingsNick").select();
  },
  "click .btn-logout": function(event, template){
    Meteor.logout();
  },
  "click .btn-facebook": function(event, template){
    Meteor.loginWithFacebook({
      loginStyle: "popup",
      requestPermissions: ['public_profile', 'email', 'user_friends']
    }, function(error){
      if(error){ alert("error: "+error); }
      else{ console.log("Logged in:"); console.log(Meteor.user()); }
    });
  },
  "mouseup .settingsNick": function(event, template) {
    event.preventDefault();
  },
  "click .btn-setnick": function(event, template) {
    var nick = $('.settingsNick').val();
    setNickname(nick);
  },
  "keypress .settingsNick": function(event, template) {
    if (event.which == 13) {
      var nick = $('.settingsNick').val();
      setNickname(nick);
    }
  },
  "mouseenter .settingsBarToggle": function(event, template) {
    settingsBarAnimate("down");
  },
  "mouseleave .settingsBarToggle": function(event, template) {
    settingsBarAnimate("up");
  },
  "click .settingsBarToggle": function(event, template) {
    settingsBarToggle();
  },
  // MESSAGE AREA EVENTS ------------------------------------
  // MESSAGE EVENTS -----------------------------------------
  "click .sendButton": function(event, template) {
    var ths = this;
    var message = $('.messageInputText')[0].value;
    sendMessage(ths, message);
  },
  "keydown .messageInputText": function(event, template) {
    var ths = this;
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault();
      var msg = $('.messageInputText').val();
      sendMessage(ths, msg);
      return false;
    }
  }
});

// Slight move of the settingsBarLine and settingsBarToggle
function settingsBarAnimate(str) {
  if (str == "down" && !isSettingBarOpen()) {
    $('.settingsBarToggle').css("padding-top", "17px");
    $('.settingsBarLine').height(12);
  } else if (str == "up" && !isSettingBarOpen()) {
    $('.settingsBarToggle').css("padding-top", "10px");
    $('.settingsBarLine').height(10);
  }
}


// Toggle settingsBar
function settingsBarToggle() {
  if (isSettingBarOpen()) { setSettingsBarState("close"); }
  else { setSettingsBarState("open"); }
}

// Open or Close the settingsBar
function setSettingsBarState(str) {
  if (str == "open" && !isSettingBarOpen()) {
    toggleSettingsBarIconTo("close");
    $('.settingsBar').addClass('active');
    $('.settingsBarLine').fadeOut('fast');
    $('.settingsBar').css("margin-top", "0px");
  } else if (str == "close" && isSettingBarOpen()) {
    toggleSettingsBarIconTo("settings");
    $('.settingsBar').removeClass('active');
    $('.settingsBarLine').show();
    var h = $('.settingsBar').height();
    $('.settingsBar').css("margin-top", -h + "px");
  }
}

// Returns true if settingsBar is open
function isSettingBarOpen() {
  return $('.settingsBar').hasClass('active');
}

// Toggle the settingsBarToggle icon to settings or close icons
function toggleSettingsBarIconTo(str) {
  if (str == "close") {
    $('.settingsBarToggle .settingsIcon').hide(0, function() {
      $('.settingsBarToggle .closeIcon').show('fast');
      $('.settingsBarToggle').css('background-color', 'transparent');
    });
  } else if (str == "settings") {
    $('.settingsBarToggle .closeIcon').hide(0, function() {
      $('.settingsBarToggle .settingsIcon').show('fast');
      $('.settingsBarToggle').css('background-color', '#402060');
    });
  }
}

// Set nickname and store it to persistent session var
function setNickname(str) {
  amplify.store("nickname", str);
  setSettingsBarState("close");
}

// Send the message
function sendMessage(ths, message) {
  if (message.length > 0){
    var nick = amplify.store("nickname");
    Meteor.call("addMessage", ths._id, nick, message, function() {
      console.log("message [" + message + "] is sent to room (" + ths._id + ")");
    });
    $('.messageInputText').val("");
  }
}

// Sets the message area to fill the available height
function setMessageAreaHeight() {
  var height = $(window).height();
  //$('.messageArea').height(height - 113);
  $('.messageScrollable').height(height - 103);
}

/*
function arrangeOnlineCounts(template){
  var sessionID = Session.get("sessionID");
  var url = template.data.url;
  Meteor.call("clientJoin", url, false);
}
*/

// Convert milliseconds to readable time passed
function millisecondsToStr (milliseconds) {

  function numberEnding (number) {
    return (number > 1) ? 's' : '';
  }
  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years && years>=0) {
    return years + ' year' + numberEnding(years) + ' ago';
  }
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days && days>=0) {
    return days + ' day' + numberEnding(days) + ' ago';
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours && hours>=0) {
    return hours + ' hour' + numberEnding(hours) + ' ago';
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes && minutes>=0) {
    return minutes + ' minute' + numberEnding(minutes) + ' ago';
  }
  var seconds = temp % 60;
  if (seconds && seconds>=0) {
    return seconds + ' second' + numberEnding(seconds) + ' ago';
  }
  return 'just now';
}
