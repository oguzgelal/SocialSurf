if (Meteor.isClient) {

  Template.chatPage.helpers({
    getUrl: function(){
      return decodeURIComponent(window.location.hash).substring(1);
    }
  });

}
