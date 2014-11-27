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
  SocketConstructor: WebSocket
};
var ddp = new DDP(options);

ddp.on("connected", function () {
  console.log("connected");
});
