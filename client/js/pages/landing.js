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
	});
}
Template.landing.destroyed = function(){
	$('body.landingPage').removeClass('landingPage');
}
