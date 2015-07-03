$(document).ready(function(){
	$(".nano").nanoScroller({ destroy: true });
	
});

Template.landing.rendered = function(){
	$('body').addClass('landingPage');

	$('body').on("scroll", function(){
		$(".anim-arrow").show();
		setTimeout(function(){
			$(".anim-arrow").fadeOut();
		},500);
	});

	$(".anim-br-light").mouseenter(function(){

	});

}
Template.landing.destroyed = function(){
	$('body.landingPage').removeClass('landingPage');
}
