var ssOn, ssOff, ssClick;
var chromeAppID = "EYhO79iz2o";
var url = window.location.href;
var local = true;
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
			ssOn.play();
			$('.activateFrameButton').removeClass('bounceOutDown');
			$('.activateFrameButton').addClass('bounceInUp');
			$('.activateFrameButton').show();
		}
		else{
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
		<div class='activateFrameButton animated bounceInUp'><img src='"+absUrlIcn+"'/></div>\
		<div class='frameContainer'><iframe src='"+baseUrl+"/?url="+encodeURIComponent(url)+"&aid="+chromeAppID+"&token="+token+"'></iframe></div>";
		$('body').append(html);

		$(document).on('click', '.activateFrameButton', function(){
			ssClick.play();
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
