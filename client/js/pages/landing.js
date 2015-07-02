Template.landing.rendered = function(){
	$('body').addClass('landingPage');
}
Template.landing.destroyed = function(){
	$('body.landingPage').removeClass('landingPage');
}