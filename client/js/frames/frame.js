Meteor.startup(function() {
  Meteor.setInterval(function(){
    Session.set('time', new Date);
  }, 1000);
});

Template.frame.helpers({
  messages: function(){ return Messages.find({},{sort:{date:1}}); },
  nickname: function(){ return amplify.store("nickname"); },
  online: function(){ return Online.find().count(); },
  getName: function(){
    if (Meteor.user()){
      var userCurrent = Members.findOne({_id: Meteor.user()._id});
      return userCurrent.name;
    }
  },
  getAvatar: function(){
    if (Meteor.user()){
      var userCurrent = Members.findOne({_id: Meteor.user()._id});
      return userCurrent.avatar;
    }
  }
});

Template.messageBox.helpers({
  timePassed: function(date){
    var now = Session.get('time') || new Date;
    var diff = now.getTime() - date.getTime();
    return Utils.mstostr(diff);
  },
  hasUser: function(){ return this.user; },

  // if the previous message belongs to the same user,
  // merge the message with the line above
  mergeLastMessage: function(){
    var currentUser = this.user;
    var currentNick = this.nick;
    var messagesArray = Messages.find({}).fetch();
    // !!!!!! TODO !!!!!!!
    // Create a field in rooms table and store the latest id or nickname ???
    // !!!!!! TODO !!!!!!!
    for(var i = 0; i < messagesArray.length; i++){
      if (messagesArray[i]._id == this._id){
        if (!messagesArray[i-1]){ return false; }
        else{
          if (messagesArray[i-1].user){
            if (!currentUser){ return false; }
            return messagesArray[i-1].user._id == currentUser._id;
          }
          else{
            if (currentUser){ return false; }
            return messagesArray[i-1].nick == currentNick;
          }
        }
      }
    }
    return false;
  }
});

$(window).resize(function(event){ $(".nano").nanoScroller({ scroll: 'bottom' }); });

Template.messageBox.rendered = function(){
  $(".nano").nanoScroller({ scroll: 'bottom' });
}

Template.frame.rendered = function() {
  var ths = this;
  // Move the settings bar upside of the screen according to its height
  var h = $('.settingsBar').height();
  $('.settingsBar').css("margin-top", -h + "px");
  // scroll to the bottom
  $(".nano").nanoScroller({ scroll: 'bottom' });
}

Template.frame.events({
  // SETTINGS BAR EVENTS ------------------------------------
  "focus .settingsNick": function(event, template){ $(".settingsNick").select(); },
  "click .btn-logout": function(event, template){ Meteor.logout(); },
  "click .btn-facebook": function(event, template){ Login.facebook(); },
  "click .btn-twitter": function(event, template){ Login.twitter(); },
  "click .btn-google": function(event, template){ Login.google(); },
  "mouseup .settingsNick": function(event, template){ event.preventDefault(); },
  "click .btn-setnick": function(event, template){ setNickname($('.settingsNick').val()); },
  "keypress .settingsNick": function(event, template) {
    if (event.which == 13){ setNickname($('.settingsNick').val()); }
  },
  "mouseenter .settingsBarToggle": function(event, template){ settingsBarAnimate("down"); },
  "mouseleave .settingsBarToggle": function(event, template){ settingsBarAnimate("up"); },
  "click .settingsBarToggle": function(event, template){ settingsBarToggle(); },
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
function isSettingBarOpen() { return $('.settingsBar').hasClass('active'); }

// Toggle the settingsBarToggle icon to settings or close icons
function toggleSettingsBarIconTo(str) {
  if (str == "close") {
    $('.settingsBarToggle .settingsIcon').hide(0, function() {
      $('.settingsBarToggle .closeIcon').show('fast');
      Session.set('frame-toggle-bg', $('.settingsBarToggle').css('background-color'));
      $('.settingsBarToggle').css('background-color', 'transparent');
    });
  } else if (str == "settings") {
    $('.settingsBarToggle .closeIcon').hide(0, function() {
      $('.settingsBarToggle .settingsIcon').show('fast');
      $('.settingsBarToggle').css('background-color', Session.get('frame-toggle-bg'));
    });
  }
}

// Set nickname and store it to persistent session var
function setNickname(str) {
  amplify.store("nickname", str);
  setSettingsBarState("close");
}

// Send the message
function sendMessage(ths, message){
  if (message.length > 0){
    // animate send icon
    var sendButtonBottom = $('.sendButton').css("bottom");
    var sendButtonRight = $('.sendButton').css("right");
    $('.sendButton').css("bottom", "48px");
    $('.sendButton').css("right", "-23px");
    $('.sendButton').css("text-shadow", "0 5px 5px gray");
    $('.sendButton').css("visibility", "hidden");
    setTimeout(function(){
      $('.sendButton').css("bottom", "-50px");
      $('.sendButton').css("right", "50px");
      setTimeout(function(){
        $('.sendButton').css("visibility", "visible");
        $('.sendButton').css("bottom", sendButtonBottom);
        $('.sendButton').css("right", sendButtonRight);
        $('.sendButton').css("text-shadow", "none");
      },200);
    },200);
    // send message
    var nick = amplify.store("nickname");
    var userSent = null;
    if (Meteor.user()){ userSent = Members.findOne({_id: Meteor.user()._id}); }
    Meteor.call("addMessage", ths._id, message, nick, userSent);
    $('.messageInputText').val("");
  }
}
