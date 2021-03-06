var ssOn, ssOff, ssClick;
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
		if (onlineres > 1){
			if (!$('.activateFrameButton').hasClass('bounceOutDown')){ ssOn.play(); }
			ssOn.play();
			$('.activateFrameButton').removeClass('bounceOutDown');
			$('.activateFrameButton').addClass('bounceInUp');
			$('.activateFrameButton').show();
		}
		else{
			if ($('.activateFrameButton').hasClass('bounceInUp')){ ssOff.play(); }
			$('.activateFrameButton').removeClass('bounceInUp');
			$('.activateFrameButton').addClass('bounceOutDown');
		}
	});
}

/****** Injection control ******/
function init(url, token){
	$(document).ready(function(){

		var dismissed = false;
		var iconHover = false;

		var absUrlIcn = chrome.extension.getURL('/assets/ssicn.png');
		var absUrlSoundOn = chrome.extension.getURL('/assets/ss_on.mp3');
		var absUrlSoundOff = chrome.extension.getURL('/assets/ss_off.mp3');
		var absUrlSoundClick = chrome.extension.getURL('/assets/ss_click.mp3');
		ssOn = new Audio(absUrlSoundOn);
		ssOff = new Audio(absUrlSoundOff);
		ssClick = new Audio(absUrlSoundClick);

		var html = "\
		<div class='backgroundFilter'></div>\
		<div class='activateFrameButton animated'><img src='"+absUrlIcn+"'/></div>\
		<div class='frameContainer'><iframe src='"+baseUrl+"/?url="+encodeURIComponent(url)+"&aid="+chromeAppID+"&token="+token+"'></iframe></div>";
		$('body').append(html);

		$(document).on('click', '.activateFrameButton', function(e){
			ssClick.play();
			$('.backgroundFilter').show();
			$('.frameContainer').show();
			$('.frameContainer').removeClass('slideOutDown');
			$('.frameContainer').addClass('slideInUp');
			e.preventDefault();
			return false;
		});

		$(document).on('click', '.backgroundFilter', function(){
			var removingOnly = true;
			$('.backgroundFilter').hide();
			$('.frameContainer').removeClass('slideInUp');
			$('.frameContainer').addClass('slideOutDown');
			$('.frameContainer').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				if($('.frameContainer').hasClass('slideOutDown')){ $('.frameContainer').hide(); }
			});
		});

		$(document).on('mouseenter', '.activateFrameButton', function(){ iconHover=true; });
		$(document).on('mouseleave', '.activateFrameButton', function(){ iconHover=false; });

		$(document).keyup(function(e){
			if (e.keyCode==27 && iconHover){
				ssOff.play();
				$('.activateFrameButton').removeClass('bounceInUp');
				$('.activateFrameButton').addClass('bounceOutDown');
				dismissed = true;
			}
		});

	});
}
