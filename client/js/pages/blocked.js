Template.blocked.rendered = function(){
	$('body').addClass('blockedPage');
}

Template.blocked.destroyed = function(){
	$('body.blockedPage').removeClass('blockedPage');
}
