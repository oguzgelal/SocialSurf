// TODO : scope of the actual backcheck reaches here ?

Meteor.methods({
	backcheck: function(url){
		//this.unblock();
		//HTTP.call("HEAD", url, function(err, res){
		//	console.log(res);
		//});
		console.log("backcheck running...");
		backcheck.check(url);
	}
});


var backcheck = {
	ignoreArgs: ["ref", "referance"],
	check: function(url){
		console.log("backcheck working...");
		console.log(url);
		return "done";
	}
};

