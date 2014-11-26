Array.prototype.clone = function() {
  return this.slice(0);
};

var options = {
  endpoint: "ws://localhost:3000/websocket",
  SocketConstructor: WebSocket
};
var ddp = new DDP(options);
var opentabs = [];

ddp.on("connected", function () {
  addCheckActiveTabs();
  tabCreated();
  tabUrlChanged();
  activeTabChanged();
  tabClosed();
  // TODO : on active tab change set badge to room count of current url
  // TODO : handle new tab and tab closed
});

function addCheckActiveTabs(){
  chrome.tabs.query({currentWindow: true}, function(tabs){
    opentabs = tabs.clone();
    handleTabs(tabs);
  });
}

function activeTabChanged(){
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
      console.log("ACTIVE_CHANGE : "+tab.url);
      setBadgeToOnlineCount(tab.url);
    });
  });
}

function tabUrlChanged(){
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    updateOpenTabs();
    if (changeInfo.url){
      console.log("UPDATE : "+changeInfo.url);
    }
  });
}

function tabCreated(){
  chrome.tabs.onCreated.addListener(function(tab){
    updateOpenTabs();
    console.log("CREATE : "+tab.url);
  });
}

function tabClosed(){
  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    chrome.tabs.query({currentWindow: true}, function(tabs){

      var opentabs_url = [];
      var tabs_url = [];
      opentabs.forEach(function(key){
        opentabs_url.push(key.url);
      }, this);
      tabs.forEach(function(key){
        tabs_url.push(key.url);
      }, this);
      var diff = [];
      opentabs_url.forEach(function(key) {
        if (-1 === tabs_url.indexOf(key)) {
          diff.push(key);
        }
      }, this);
      console.log(diff); // closed urls

      opentabs = tabs.clone();
    });

    //ddp.method("leaveRoom", [url], function (err, res) {
    //  if (err) throw err;
    //  callback();
    //});
  });
}

function setBadgeToOnlineCount(url){
  ddp.method("getOnlineCount", [url], function (err, res) {
    if (err) throw err;
    if (res){
      chrome.browserAction.setBadgeText({text: String(res)});
    }
    else{
      chrome.browserAction.setBadgeText({text: "0"});
    }
  });
}

function updateOpenTabs(){
  chrome.tabs.query({currentWindow: true}, function(tabs){
    opentabs = tabs.clone();
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
