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

  // Alert the background script so that it could update the app badge
  chrome.runtime.sendMessage({connection: "connectedToServer"}, function(response) {
    console.log(response.farewell);
  });

  var url = window.location.href;
  var sessionID = res.session;
  console.log("Connected ["+res.session+"]...");
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
