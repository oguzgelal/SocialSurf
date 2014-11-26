Meteor.startup(function() {

  if (!amplify.store("nickname")){
    amplify.store("nickname", "Anonymouse");
  }

});
