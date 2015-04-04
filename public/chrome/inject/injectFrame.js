/* Author : Oguz Gelal
* This script is injected into every single tab. It opens
* a socket connection between the server and each tab. The purpose is
* to monitor the online count to the url. A socket connection is
* more reliable than listening to tab action because the online count
* should also be decreased when a tab or chrome itself
* terminates unexpectedly. When that happens, connection closes
* and the server decreases the online count of the url which the
* closed tab(s) was/were connected to. */

var url = window.location.href;
var local = true; // Change to false before deploying to server
var domain = "socialweb.meteor.com";

var baseUrl = "";
if (local){ baseUrl = "http://localhost:3000/frame"; }
else{ baseUrl = "https://"+domain+"/frame"; }

var options = {
	SocketConstructor: WebSocket,
	do_not_autoreconnect: true
};

/* WARNING
* wss:// only works on servers with HTTPS. If testing locally or on a server without
* HTTPS certificate, ws:// will be used. In that case, injections to HTTPS sites
* will not work. */
if (local){ options["endpoint"]="ws://localhost:3000/websocket"; }
else{ options["endpoint"]="wss://"+domain+"/websocket"; }

var ddp = new DDP(options);

ddp.on("connected", function (res) {
	var clientID = res.session;
	console.log("Connected ["+clientID+"]...");
	ddp.method("cleanURL", [url], function(err, url){
		init(url);
		/* Send request to the server containing the clientID and the url
		* The purpose of this is when client is connected, the server
		* doesn't know what the url is. Client uses this request to make
		* the server match the clientID and current URL. Also the idle
		* variable is set to true that means the user is idle not online. */
		ddp.method("clientJoin", [clientID, url], function(err, res){
			console.log("Join Request Sent ["+clientID+"]...");
			onlineCountChecker(url);
			//ddp.method("getOnlineCount", [url], function(err, res){ setOnlineCount(res); });
		});
	});
});
ddp.on("error", function(e){
	console.log("error...");
	console.log(e);
});
ddp.on("failed", function(e){
	console.log("failed...");
	console.log(e);
});
ddp.on("socket_close", function(e){
	console.log("socket_close...");
	console.log(e);
});
ddp.on("socket_error", function(e){
	console.log("socket_error...");
	console.log(e);
});

/****** Injection control ******/

function init(url){
	$(document).ready(function(){

		var html = "\
		<div class='backgroundFilter'></div>\
		<div class='activateFrameButton animated infinite pulse'></div>\
		<div class='frameContainer'><iframe src='"+baseUrl+"/"+encodeURIComponent(url)+"'></iframe></div>";
		$('body').append(html);

		$(document).on('mouseenter', '.activateFrameButton', function(){
			$(this).removeClass('animated infinite pulse');
		});
		$(document).on('mouseleave', '.activateFrameButton', function(){
			$(this).addClass('animated infinite pulse');
		});

		$(document).on('click', '.activateFrameButton', function(){
			//$('body').css('overflow', 'hidden');
			//$('body').css('height', '100%');
			$('.backgroundFilter').show();
			$('.frameContainer').show();
			$('.frameContainer').removeClass('animated slideInUp slideOutDown');
			$('.frameContainer').addClass('animated slideInUp');
		});

		$(document).on('click', '.backgroundFilter:not(.frameContainer)', function(){
			//$('body').css('overflow', 'auto');
			//$('body').css('height', 'auto');
			$('.backgroundFilter').hide();
			$('.frameContainer').removeClass('animated slideInUp');
			$('.frameContainer').addClass('animated slideOutDown');
			$('.frameContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.frameContainer').hide();
			});
		});
	});
}

// TODO : refresh every 3 secs ?! what year are we in ? do something about this !
function onlineCountChecker(url){
	ddp.method("getOnlineCount", [url], function(err, res){ $('.activateFrameButton').html(res); });
	setInterval(function(){
		ddp.method("getOnlineCount", [url], function(err, res){ $('.activateFrameButton').html(res); });
	},3000);
}