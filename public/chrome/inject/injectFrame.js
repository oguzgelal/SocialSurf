var chromeAppID = "EYhO79iz2o";
var url = window.location.href;
var local = false;
var domain = "socialsurf.io";
var baseUrl = "";
if (local){ baseUrl = "http://localhost:3000/frame"; }
else{ baseUrl = "https://"+domain+"/frame"; }
var endpoint = "";
if (local){ endpoint="ws://localhost:3000/websocket"; }
else{ endpoint="wss://"+domain+"/websocket"; }
var ddp = new MeteorDdp(endpoint);
ddp.connect().done(function(res) {
	ddp.call('requestToken', [chromeAppID, url]).done(function(token){
		init(url, token);
		$(document).ready(function(){ updateOnlineBadge(ddp,url); });
		ddp.subscribe('online', [url]).done(function(){
			ddp.watch('online', function(changedDoc, message) {
				updateOnlineBadge(ddp,url);
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
function init(url, token){
	$(document).ready(function(){

		var html = "\
		<div class='backgroundFilter'></div>\
		<div class='activateFrameButton animated infinite pulse'></div>\
		<div class='frameContainer'><iframe src='"+baseUrl+"/"+encodeURIComponent(url)+"/?aid="+chromeAppID+"&token="+token+"'></iframe></div>";
		$('body').append(html);

		$(document).on('mouseenter', '.activateFrameButton', function(){
			$(this).removeClass('animated infinite pulse');
		});
		$(document).on('mouseleave', '.activateFrameButton', function(){
			$(this).addClass('animated infinite pulse');
		});

		$(document).on('click', '.activateFrameButton', function(){
			$('.backgroundFilter').show();
			$('.frameContainer').show();
			$('.frameContainer').removeClass('animated slideInUp slideOutDown');
			$('.frameContainer').addClass('animated slideInUp');
		});

		$(document).on('click', '.backgroundFilter:not(.frameContainer)', function(){
			$('.backgroundFilter').hide();
			$('.frameContainer').removeClass('animated slideInUp');
			$('.frameContainer').addClass('animated slideOutDown');
			$('.frameContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.frameContainer').hide();
			});
		});
	});
}
