var options = {
  endpoint: "ws://localhost:3000/websocket",
  SocketConstructor: WebSocket
};
var ddp = new DDP(options);

ddp.on("connected", function () {
  subscribeActiveTabs();
  // TODO : on active tab change set badge to room count of current url
  // TODO : handle new tab and tab closed
  chrome.browserAction.setBadgeText({text: "hey!"});
});

function subscribeActiveTabs(){
  chrome.tabs.getAllInWindow(null, function(tabs){
    handleTabs(tabs);
  });
}

// Recursive loop that fires with callbacks
function handleTabs(arr){
  var i = 0;
  var loop = function(arr){
    var url = encodeURIComponent(arr[i].url);
    handleTab(url, function(){
      i++;
      if (i < arr.length){
        loop(arr);
      }
    });
  }
  loop(arr);
}
function handleTab(url, callback){
  ddp.method("addCheckRoom", [url], function (err, res) {
    if (err) throw err;
    ddp.method("joinRoom", [url], function (err, res) {
      if (err) throw err;
      callback();
    });
  });
}
