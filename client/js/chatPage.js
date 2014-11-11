Template.chatPage.helpers({
  getUrl: function(){
    var currentUrl = decodeURIComponent(window.location.hash).substring(1);
    Session.set("currentUrl", currentUrl);
    return currentUrl;
  },
  urls: function(){
    return Rooms.find({});
  }
});
