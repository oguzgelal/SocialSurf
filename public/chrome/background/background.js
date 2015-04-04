/*
 * Author : Oguz Gelal
 * This script works on the background and it monitors the
 * chrome tab and windows actions to set the chrome application
 * badge to the online count of the current tabs url.
 */

// After client content script connects to the server, it alerts the
// background page to update the app badge
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if (message.connection == "connectedToServer"){
    setActiveToBadge();
  }
});

var options = {
  /*
  * WARNING
  * wss:// doesn't work on local server and cannot connect over sites that uses HTTPS.
  * It only works when deployed to meteor servers. Test locally with ws:// and with
  * sites that use HTTP not HTTPS. Before deploying, comment out ws:// line and uncomment
  * wss:// line
  */
  endpoint: "ws://localhost:3000/websocket",
  //endpoint: "wss://socialweb.meteor.com/websocket",
  SocketConstructor: WebSocket,
  do_not_autoreconnect: true
};

var ddp = new DDP(options);
var opentabs = [];

ddp.on("connected", function () {
  windowFocusChanged();
  activeTabChanged();
  tabUrlChanged();
});

// Fires when the chrome window gets focus
function windowFocusChanged(){
  chrome.windows.onFocusChanged.addListener(function(windowid){
    var options = {
      windowId: windowid,
      active: true
    };
    chrome.tabs.query(options, function(tab){
      setBadgeToOnlineCount(tab[0].url);
    });
  });
}

// Fires when tabs are switched
function activeTabChanged(){
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
      setBadgeToOnlineCount(tab.url);
    });
  });
}

// Fires when the url of the currect tan changes
function tabUrlChanged(){
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url){
      setBadgeToOnlineCount(changeInfo.url);
    }
  });
}

// Get active tab and set the app badge to online count of its url
function setActiveToBadge(){
  var options = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(options, function(tab){
    setBadgeToOnlineCount(tab[0].url);
  });
}

// Get the url, request for online count, set the badge
function setBadgeToOnlineCount(url){
  ddp.method("getOnlineCount", [url], function (err, res) {
    if (err) throw err;
    if (res){ chrome.browserAction.setBadgeText({text: String(res)}); }
    else{ chrome.browserAction.setBadgeText({text: "X"}); }
  });
}
