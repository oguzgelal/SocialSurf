$(document).ready(function(){
  var baseUrl = "http://localhost:3000";
  var passUrl = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    passUrl = tabs[0].url;
    passUrl = encodeURIComponent(passUrl);
    var url = baseUrl+"#"+passUrl;
    $('iframe').prop('src', url);
  });

});
