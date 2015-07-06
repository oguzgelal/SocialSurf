$(document).ready(function(){
	//$(".nano").nanoScroller({ destroy: true });
});

Template.landing.rendered = function(){
	$(document).ready(function(){
		var click =((document.ontouchstart!==null)?'click':'touchstart');

		$('body').addClass('landingPage');

		$('body').on("scroll", function(){
			if (!$(".anim-arrow").hasClass('noshow')){
				$(".anim-arrow").show();
				setTimeout(function(){ $(".anim-arrow").hide(); },1000);
			}
		});

		$(document).on("mouseenter", '.reveal-arrow', function(){
			if (!$(".anim-arrow").hasClass('noshow')){ $(".anim-arrow").show(); }
		});
		$(document).on("mouseleave", '.reveal-arrow', function(){
			$(".anim-arrow").hide();
		});

		$(document).on(click, '.anim-br-button', function(){
			$(this).hide();
			$('.anim-arrow').hide();
			$('.anim-arrow').addClass('noshow');
			$('.anim-br-light').hide();
			$('.anim-br-dark').show();

			var wireframeHeight = $('.anim-ss-wireframe').height();
			var wireframeOffset = 6;
			$('.anim-ss-wireframe').animate({
				bottom: '+='+(wireframeHeight+wireframeOffset)
			}, 300, function(){ console.log("hellooo"); });

			$(".landing-br-f1").fadeOut('fast', function(){
				$(".landing-br-f2").fadeIn('fast');
			});
		});

		$(document).on(click, '.anim-br-dark', function(){
			$('.anim-arrow').removeClass('noshow');
			$('.anim-br-light').show();
			$('.anim-br-dark').hide();

			var wireframeHeight = $('.anim-ss-wireframe').height();
			var wireframeOffset = 6;
			$('.anim-ss-wireframe').animate({
				bottom: '-='+(wireframeHeight+wireframeOffset)
			}, 300, function(){ $('.anim-br-button').fadeIn('fast'); });

			$(".landing-br-f2").fadeOut('fast', function(){
				$(".landing-br-f1").fadeIn('fast');
			});
		});

		$(document).on(click, '.line-video-thumb', function(e){
			$('.landing-video-player').hide();
			$('.landing-video-container').hide();
			$('.landing-video-container').html("");

			$('.landing-video-player').show();
			var embedHtml = "<iframe class='animated zoomIn' src='https://www.youtube.com/embed/IJNR2EpS0jw?rel=0&amp;showinfo=0&autoplay=1&fs=0' frameborder='0' allowfullscreen></iframe>";
			$('.landing-video-container').show();
			$('.landing-video-container').append(embedHtml);
			e.preventDefault();
			return false;
		});
		$(document).on(click, '.landing-video-close', function(){
			$('.landing-video-container iframe').removeClass('zoomIn');
			$('.landing-video-container iframe').addClass('zoomOut');
			$('.landing-video-player').fadeOut('fast');
			setTimeout(function(){
				$('.landing-video-container').html("");
				$('.landing-video-player').hide();
			},300);
		});
		$(document).on(click, '.landing-video-player', function(){
			$('.landing-video-container iframe').removeClass('zoomIn');
			$('.landing-video-container iframe').addClass('zoomOut');
			$('.landing-video-player').fadeOut('fast');
			setTimeout(function(){
				$('.landing-video-container').html("");
				$('.landing-video-player').hide();
			},300);
		});


		$(document).on(click, '.landing-notify-btn', function(){ emailButtonClicked(); });
		$(document).on('keydown', '.landing-notify-txt', function(e){
			if (e.keyCode==13){ emailButtonClicked(); }
		});

		function emailButtonClicked(){
			var email = $('.landing-notify-txt').val();
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			var clickElemCurText = $('.landing-notify-btn').val();
			var clickElem = $('.landing-notify-btn');
			if (email.length>0 && re.test(email)){
				clickElem.html("<i class='fa fa-spin fa-spinner'></i> Sending");
				Meteor.call('addEmail', email, function(err, res){
					console.log(res);
					if (res){
						flashEmailInput("#3c763d", "#dff0d8");
						clickElem.html("You'll hear from us");
						clickElem.prop("disabled",true);
						clickElem.addClass('disabled');
					}
					else{
						flashEmailInput("#a94442", "#f2dede");
						clickElem.html(clickElemCurText);
					}
				});
			}
			else{
				flashEmailInput("#a94442", "#f2dede");
				clickElem.html(clickElemCurText);
			}
		}

		function flashEmailInput(textColor, bgColor){
			var currentBgColor = 'whitesmoke';
			var currentColor = 'rgb(140,152,158)';
			$('.landing-notify-txt').css("background-color", bgColor);
			$('.landing-notify-txt').css("color", textColor);
			setTimeout(function(){
				$('.landing-notify-txt').css("background-color", currentBgColor);
				$('.landing-notify-txt').css("color", currentColor);
			},500);
		}

	});
}
Template.landing.destroyed = function(){
	$('body.landingPage').removeClass('landingPage');
}
