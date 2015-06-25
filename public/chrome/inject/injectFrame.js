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
var local = false; // Change to false before deploying to server
var domain = "socialweb.meteor.com";


var baseUrl = "";
if (local){ baseUrl = "http://localhost:3000/frame"; }
else{ baseUrl = "https://"+domain+"/frame"; }


/* WARNING
* wss:// only works on servers with HTTPS. If testing locally or on a server without
* HTTPS certificate, ws:// will be used. In that case, injections to HTTPS sites
* will not work. */
var endpoint = "";
if (local){ endpoint="ws://localhost:3000/websocket"; }
else{ endpoint="wss://"+domain+"/websocket"; }


var ddp = new MeteorDdp(endpoint);
ddp.connect().done(function(res) {
	var clientID = res.session;
	console.log("Connected ["+clientID+"]...");

	// Get the URL cleaned
	ddp.call('cleanURL', [url]).done(function(urlRes){
		url = urlRes;
		init(url);
		console.log("Cleaned: "+url);

		// Join request to the server
		ddp.call('clientJoin', [clientID, url]).done(function(){
			console.log("Join Request Sent ["+clientID+"]...");

			$(document).ready(function(){ updateOnlineBadge(ddp,url); });

			// Subscripbe to online collection and listen changes
			ddp.subscribe('online', [url]).done(function(){
				ddp.watch('online', function(changedDoc, message) {
					updateOnlineBadge(ddp,url);
				});
			});

			
		});
	});	
});

function updateOnlineBadge(ddp, url){
	ddp.call('getOnlineCount', [url]).done(function(onlineres){
		$('.activateFrameButton').html(onlineres);
	});
}

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
