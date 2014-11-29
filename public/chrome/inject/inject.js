/*
 * Author : Oguz Gelal
 * This script is injected into every single tab. It opens
 * a socket connection between the server and each tab. The purpose is
 * to monitor the online count to the url. A socket connection is
 * more reliable than listening to tab action because the online count
 * should also be decreased when a tab or chrome itself
 * terminates unexpectedly. When that happens, connection closes
 * and the server decreases the online count of the url which the
 * closed tab(s) was/were connected to.
 */
var options = {

  /*
  * WARNING
  * wss:// doesn't work on local server and cannot connect over sites that uses HTTPS.
  * It only works when deployed to meteor servers. Test locally with ws:// and with
  * sites that use HTTP not HTTPS. Before deploying, comment out ws:// line and uncomment
  * wss:// line
  */

  endpoint: "ws://localhost:3000/websocket",
  //endpoint: "wss://chromely.meteor.com/websocket",
  SocketConstructor: WebSocket,
  do_not_autoreconnect: true
};

var ddp = new DDP(options);

ddp.on("connected", function (res) {

  var url = window.location.href;
  var sessionID = res.session;
  console.log("Connected ["+res.session+"]...");

  // Alert the background script so that it could update the app badge
  chrome.runtime.sendMessage({connection: "connectedToServer"}, function(response) {
    console.log(response);
  });

  // Send request to the server containing the sessionID and the url
  // The purpose of this is when client is connected, the server
  // doesn't know what the url is. Client uses this request to make
  // the server match the sessionID and current URL
  ddp.method("clientJoin", [sessionID, url], function(err, res){
    console.log("Join Request ["+sessionID+"]...");
  });

});

ddp.on("error", function(){
  console.log("error...");
});

ddp.on("failed", function(){
  console.log("failed...");
});

ddp.on("socket_close", function(){
  console.log("socket_close...");
});

ddp.on("socket_error", function(){
  console.log("socket_error...");
});
