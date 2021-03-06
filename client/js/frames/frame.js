window.loadedMessages = {};

Meteor.startup(function(){
  Meteor.setInterval(function(){
    Session.set('time', new Date);
  }, 1000);
});


$(document).on('keydown', '.messageInputText', function(){
  $(".nano").nanoScroller({ scroll: 'bottom' });
});

$(window).resize(function(event){
  $(".nano").nanoScroller({ scroll: 'bottom' });
});

/**************************** FRAME ****************************/

Template.frame.created = function(){
  this.lastMsgTime = new ReactiveVar(-1);
  this.lastMsgDisplayable = new ReactiveVar(-1);
  this.lastMsgID = new ReactiveVar(-1);
  
  if (Meteor.user()){ amplitude.setUserId(Meteor.user()._id); }
}

Template.frame.onCreated(function(){
  var instance = this;
  var roomID = instance.data.room._id;
  instance.currentData = new ReactiveVar();
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(30);
  instance.loadCount = new ReactiveVar(10);
  instance.autorun(function(){
    var limit = instance.limit.get();
    var loaded = instance.loaded.get();
    var subscription = instance.subscribe('messages', roomID, limit);
    if (subscription.ready()){
      instance.loaded.set(limit);
      $('.loadingBar').slideUp();
    }
  });
  instance.posts = function(){
    return Messages.find({},{limit: instance.limit.get(), sort:{date:1}}).map(function(message, seqID){
      // TODO : this works but it gets re-rendered every time a message appears.
      // Increase the limit by one each time a new message is received
      if (!loadedMessages[message._id]){
        loadedMessages[message._id] = message;
        loadedMessages[message._id].limitUpdate = false;
      }
      var msgSentMs = message.date.getTime();
      var currentDate = new Date();
      var currentMs = currentDate.getTime();
      var msgOffset = currentMs-msgSentMs;
      var allowedOffset = 10000;
      if (msgOffset<=allowedOffset && !loadedMessages[message._id].limitUpdate){
        instance.limit.set(instance.limit.get()+1);
        loadedMessages[message._id].limitUpdate = true;
      }
      // concat
      message.seqID = seqID;
      message.concat = false;
      message.concatSeqID = -1;
      if (loadedMessages[seqID-1]){
        var lastMsg = loadedMessages[seqID-1];
        var maxGapTime = 120000;
        var currentDisplayable = MessageUtils.getDisplayable(message);
        var currentTime = message.date.getTime();
        var lastMsgDisplayable = MessageUtils.getDisplayable(lastMsg);
        var lastTime = lastMsg.date.getTime();
        var concatDisplayable = currentDisplayable===lastMsgDisplayable;
        var concatTime = currentTime - lastTime <= maxGapTime;
        var concatResult = concatDisplayable & concatTime;
        message.concat = concatResult;
        if (concatResult){
          for(var i=seqID-1; i>=0; i--){
            var prevMsg = loadedMessages[i];
            if(!prevMsg.concat){
              message.concatSeqID=prevMsg.seqID;
              message.concatMsgID=prevMsg._id;
              break;
            }
          }
        }
      }
      loadedMessages[seqID] = message;
      return message
    });
  }
});

Template.frame.onRendered(function(){
  var instance = this;
  $(".nano").nanoScroller();
  $(".nano").nanoScroller({ iOSNativeScrolling: true });
  $(".nano").nanoScroller({ scroll: 'bottom' });
  // scroll up to load more
  $(".nano").on("update", function(event, val){
    Session.set("position", val.position);
    Session.set("maximum", val.maximum);
    var scrollPercentRaw = val.position / val.maximum;
    var scrollPercent = Math.floor(scrollPercentRaw*100);
    if (scrollPercent == 0 && val.direction=="up"){
      $('.loadingBar').slideDown();
      var limit = instance.loaded.get();
      var loadCount = instance.loadCount.get();
      limit += loadCount;
      instance.limit.set(limit);
    }
  });
});

Template.frame.helpers({
  messages: function (){ return Template.instance().posts(); },
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
      var securedAvatar = userCurrent.avatar.replace("http://", "https://");
      return securedAvatar;
    }
  }
});

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

/**************************** MSGBOX ****************************/

Template.messageBox.helpers({
  timePassed: function(){
    var now = Session.get('time') || new Date;
    var diff = now.getTime() - this.date.getTime();
    return Utils.mstostr(diff);
  },
  hasUser: function(){ return this.user; },
  getAvatar: function(){
    if (this.user){
      var securedAvatar = this.user.avatar.replace("http://", "https://");
      return securedAvatar;
    }
  },
  msgid: function(){ return this._id; },
  msgtime: function(){ return this.date.getTime(); },
  displayable: function(){ return MessageUtils.getDisplayable(this); },
  displayable_enc: function(){ return encodeURIComponent(MessageUtils.getDisplayable(this)); },
});

Template.messageBox.rendered = function(){
  //console.log(Template["frame"]);
  if (this.data.concat){
    var seqID = this.data.seqID;
    var concatSeqID = this.data.concatSeqID;
    var concatMsgID = this.data.concatMsgID;
    var message = this.data.message;
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    function replaceTag(tag){ return tagsToReplace[tag] || tag; }
    function safe_tags_replace(str){ return str.replace(/[&<>]/g, replaceTag); }
    if (message){ message = safe_tags_replace(message); }
    $('.msgbox#'+concatSeqID+'[data-id="'+concatMsgID+'"]').find('.msgbox-text').append("<div class='msgbox-appended'>"+message+"</div>");
    this.firstNode.remove();
  }
  var matchID = this.data.nick+""+this.data.date.getTime();
  $('.msgbox[data-matchID="'+matchID+'"]').remove();
}

Template.messageBox.onRendered(function(){
  // only scroll down when scroll percent below 85
  $(".nano").nanoScroller();
  $(".nano").nanoScroller({ scroll: 'bottom' });
  /* TODO : fix this
  var currentPosition = Session.get("position");
  var currentMaximum = Session.get("maximum");
  if (currentPosition==undefined || currentMaximum==undefined){ $(".nano").nanoScroller({ scroll: 'bottom' }); }
  else{
    var scrollDownLimit = 85;
    var currentPercent = Math.floor((currentPosition / currentMaximum) * 100);
    if (currentPercent >= scrollDownLimit){
      $(".nano").nanoScroller({ scroll: 'bottom' });
    }
  }
  */
});

/**************************** METHODS ****************************/


// Slight move of the settingsBarLine and settingsBarToggle
function settingsBarAnimate(str) {
  if (str == "down" && !isSettingBarOpen()) {
    $('.settingsBarToggle').css("padding-top", "7px");
    $('.settingsBarLine').height(12);
  } else if (str == "up" && !isSettingBarOpen()) {
    $('.settingsBarToggle').css("padding-top", "4px");
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
  var sentTime = new Date();
  var sentMS = sentTime.getTime();
  if (message.length > 0){
    // animate send icon
    var sendButtonRight = "18px";
    var sendButtonBottom = "-3px";
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
    
    var nick = amplify.store("nickname");
    var userSent = null;
    if (Meteor.user()){ userSent = Members.findOne({_id: Meteor.user()._id}); }
    // set current user properties for stats
    if (userSent){ amplitude.setUserProperties(userSent); }
    // generate a unique ID to match when data comes from the server
    var matchID = nick+""+sentMS;
    var data = {
      roomid: ths.room._id,
      nick: nick,
      user: userSent,
      message: message,
      date: new Date(),
      matchID: matchID,
      loadingBar: true
    };
    // log message for stats
    amplitude.logEvent("Message Sent", data);
    if (userSent){ GAnalytics.event("Message Sent", ths.room._id+"-"+userSent._id); }
    else{ GAnalytics.event("Message Sent", ths.room._id+"-"+"anonymous"); }
    
    // render messageBox template and add the message in loading form to the DOM
    var preMessageHTML = Blaze.toHTMLWithData(Template.messageBox, data);
    $('.messageArea').append(preMessageHTML);
    $(".nano").nanoScroller();
    $(".nano").nanoScroller({ scroll: 'bottom' });
    setTimeout(function(){ $(".nano").nanoScroller(); $(".nano").nanoScroller({ scroll: 'bottom' }); },100);

    Meteor.call("addMessage", ths.room._id, message, nick, userSent, sentTime);
    $('.messageInputText').val("");
  }
}
