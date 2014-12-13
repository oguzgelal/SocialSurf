$(document).ready(function(){
  //var baseUrl = "http://chromely.meteor.com/chat";
  var baseUrl = "http://localhost:3000/chat";
  var passUrl = "";
  var passSession = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    passUrl = tabs[0].url;
    passUrl = encodeURIComponent(passUrl);

    // Check the sessionID from the content script of the active tab
    chrome.tabs.sendMessage(tabs[0].id, {action: "getSessionID"}, function(response){
      passSession = response.sessionID;
      var url = baseUrl+'/'+passUrl+'/'+passSession;
      $('iframe').prop('src', url);

    });
  });

});
