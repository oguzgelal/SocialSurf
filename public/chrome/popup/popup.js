$(document).ready(function(){
  //var baseUrl = "http://chromely.meteor.com/chat/";
  var baseUrl = "http://localhost:3000/chat/";
  var passUrl = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    passUrl = tabs[0].url;
    passUrl = encodeURIComponent(passUrl);
    console.log(passUrl);
    var url = baseUrl+passUrl;
    $('iframe').prop('src', url);
  });

});
