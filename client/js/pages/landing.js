$(document).ready(function(){
	//$(".nano").nanoScroller({ destroy: true });
});

Template.landing.rendered = function(){
	$(document).ready(function(){
		var click =((document.ontouchstart!==null)?'click':'touchend');

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

		$(document).on("click", '.line-video-thumb', function(e){
			$('.landing-video-player').hide();
			$('.landing-video-container').hide();
			$('.landing-video-container').html("");

			$('.landing-video-player').show();
			var embedHtml = "<iframe class='animated zoomIn' src='https://www.youtube.com/embed/Z0WgLjzhsGk?rel=0&amp;showinfo=0&autoplay=1&fs=0' frameborder='0' allowfullscreen></iframe>";
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


		// email click listener - footer
		$(document).on(click, '.landing-notify-btn-footer', function(){
			emailButtonClicked($('.landing-notify-txt-footer'),$('.landing-notify-btn-footer'));
		});
		$(document).on('keydown', '.landing-notify-txt-footer', function(e){
			if (e.keyCode==13){
				emailButtonClicked($('.landing-notify-txt-footer'),$('.landing-notify-btn-footer'));
			}
		});

		// email click listener - modal
		$(document).on(click, '.landing-notify-btn-modal', function(){
			emailButtonClicked($('.landing-notify-txt-modal'),$('.landing-notify-btn-modal'));
		});
		$(document).on('keydown', '.landing-notify-txt-modal', function(e){
			if (e.keyCode==13){
				emailButtonClicked($('.landing-notify-txt-modal'),$('.landing-notify-btn-modal'));
			}
		});

		function modalClose(ths){
			ths.parent().removeClass('fadeInUp');
			ths.parent().addClass('fadeOutUp');
			setTimeout(function(){
				ths.parent().parent().remove();
			},500);
		}

		$(document).on(click, '.landing-modal-close', function(){
			var ths = $(this);
			modalClose(ths);
		});

		$(document).on(click, '.landing-modal', function(e){ modalClose($('.landing-modal-close')); });
		$(document).on(click, '.landing-notify-txt-modal', function(e){
			$(this).focus();
		});
		$(document).on(click, '.landing-modal-content', function(e){
			e.preventDefault();
			return false;
		});
		


		// product actions
		$(document).on("click", '.landing-product-chrome', function(){
			//var modalTitle = "Link will be updated...";
			//var modalDesc = "Enjoy! Don't forget to leave a feedback.";
			//var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
			//$('body').append(modal);
			window.location.href = 'https://chrome.google.com/webstore/detail/social-surf/omhjlpahalmgdkhbhggoflffemogdmkp';
		});
		$(document).on("click", '.landing-product-firefox', function(){
			var modalTitle = "Firefox Extension will soon be ready.";
			var modalDesc = "Our team is working hard to make this available to you. Drop your email, we'll let you know as soon as it is out.";
			var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
			$('body').append(modal);
		});
		$(document).on("click", '.landing-product-safari', function(){
			var modalTitle = "Safari Extension will soon be ready.";
			var modalDesc = "Our team is working hard to make this available to you. Drop your email, we'll let you know as soon as it is out.";
			var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
			$('body').append(modal);
		});
		$(document).on("click", '.landing-product-opera', function(){
			var modalTitle = "Opera Extension will soon be ready.";
			var modalDesc = "Our team is working hard to make this available to you. Drop your email, we'll let you know as soon as it is out.";
			var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
			$('body').append(modal);
		});
		$(document).on("click", '.landing-product-web', function(){
			var modalTitle = "Our web interface will soon be ready.";
			var modalDesc = "You will be able to use Social Surf from this website. But not now, very soon. Drop your mail and we'll let you know when it is ready.";
			var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
			$('body').append(modal);
		});
		$(document).on("click", '.landing-product-dev', function(){
			var modalTitle = "Upcoming awesomeness";
			var modalDesc = "Developers! <br><br> Not only you'll be able to integrate our chat console to your website, but you'll also be able to send each user private messages and use this as a feedback tool. <br><br> Oh, and there will be <b>Wordpress</b>, <b>Drupal</b> and <b>Joomla</b> plugins that will make you integrate socialsurf without seeing a single line of code :)";
		var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
		$('body').append(modal);
	});
$(document).on("click", '.landing-product-android', function(){
	var modalTitle = "Mobile revolution...";
	var modalDesc = "How would you like to use Social Surf from your Android ? Drop your email and we'll let you know when you can.";
	var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
	$('body').append(modal);
});
$(document).on("click", '.landing-product-ios', function(){
	var modalTitle = "Mobile revolution...";
	var modalDesc = "How would you like to use Social Surf from your iPhone or iPad ? Drop your email and we'll let you know when you can.";
	var modal = "<div class='landing-modal'><div class='landing-modal-content animated fadeInUp'><i class='fa fa-times landing-modal-close'></i><div class='modal-dropmail'><div class='landing-notify-label'>"+modalTitle+"</div><div class='landing-maillabel'>"+modalDesc+"</div><div class='landing-mailinput'><input class='landing-notify-txt landing-notify-txt-modal' type='text' placeholder='your email here...'><div class='landing-notify-btn landing-notify-btn-modal'>get updated</div></div></div></div></div>";
	$('body').append(modal);
});



		// setting bar events
		$(document).on('mouseenter', '.landingBarToggle', function(){ settingsBarAnimate("down"); });
		$(document).on('mouseleave', '.landingBarToggle', function(){ settingsBarAnimate("up"); });
		$(document).on(click, '.landingBarToggle', function(){ settingsBarToggle(); });


		function emailButtonClicked(landingNotifyText, landingNotifyButton){
			var email = landingNotifyText.val();
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			var clickElemCurText = landingNotifyButton.text();
			var clickElem = landingNotifyButton;
			if (email.length>0 && re.test(email)){
				clickElem.html("<i class='fa fa-spin fa-spinner'></i> Sending");
				Meteor.call('addEmail', email, function(err, res){
					console.log(res);
					if (res){
						flashEmailInput("#3c763d", "#dff0d8", landingNotifyText);
						clickElem.html("You'll hear from us");
						clickElem.prop("disabled",true);
						clickElem.addClass('disabled');
					}
					else{
						flashEmailInput("#a94442", "#f2dede", landingNotifyText);
						clickElem.html(clickElemCurText);
					}
				});
			}
			else{
				flashEmailInput("#a94442", "#f2dede", landingNotifyText);
				clickElem.html(clickElemCurText);
			}
		}

		function flashEmailInput(textColor, bgColor, landingNotifyText){
			var currentBgColor = 'whitesmoke';
			var currentColor = 'rgb(140,152,158)';
			landingNotifyText.css("background-color", bgColor);
			landingNotifyText.css("color", textColor);
			setTimeout(function(){
				landingNotifyText.css("background-color", currentBgColor);
				landingNotifyText.css("color", currentColor);
			},500);
		}



		// settings bar functions ----------------------------------
		function settingsBarAnimate(str) {
			if (str == "down" && !isSettingBarOpen()) {
				$('.landingBarToggle').css("padding-top", "17px");
				$('.landingBarLine').height(12);
			} else if (str == "up" && !isSettingBarOpen()) {
				$('.landingBarToggle').css("padding-top", "10px");
				$('.landingBarLine').height(10);
			}
		}
		function settingsBarToggle() {
			if (isSettingBarOpen()) { setSettingsBarState("close"); }
			else { setSettingsBarState("open"); }
		}
		function setSettingsBarState(str) {
			if (str == "open" && !isSettingBarOpen()) {
				toggleSettingsBarIconTo("close");
				$('.landingBarToggle').addClass('active');
				$('.landingBar').addClass('active');
				$('.landingBarLine').fadeOut('fast');
				$('.landingBar').css("margin-top", "0px");
			} else if (str == "close" && isSettingBarOpen()) {
				toggleSettingsBarIconTo("settings");
				$('.landingBarToggle').removeClass('active');
				$('.landingBar').removeClass('active');
				$('.landingBarLine').show();
				var h = $('.landingBar').height();
				$('.landingBar').css("margin-top", -h + "px");
			}
		}
		function isSettingBarOpen() { return $('.landingBar').hasClass('active'); }
		function toggleSettingsBarIconTo(str) {
			if (str == "close") {
				$('.landingBarToggle .landingIcon').hide(0, function() {
					$('.landingBarToggle .closeIcon').show('fast');
					Session.set('frame-toggle-bg', $('.landingBarToggle').css('background-color'));
					$('.landingBarToggle').css('background-color', 'transparent');
				});
			} else if (str == "settings") {
				$('.landingBarToggle .closeIcon').hide(0, function() {
					$('.landingBarToggle .landingIcon').show('fast');
					$('.landingBarToggle').css('background-color', Session.get('frame-toggle-bg'));
				});
			}
		}
		// -----------------------------------------------



	});
}
Template.landing.destroyed = function(){
	$('body.landingPage').removeClass('landingPage');
}
