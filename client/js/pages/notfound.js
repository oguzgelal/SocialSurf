Template.notfound.rendered = function(){
	$('body').addClass('notfoundPage');
}

Template.notfound.destroyed = function(){
	$('body.notfoundPage').removeClass('notfoundPage');
}
