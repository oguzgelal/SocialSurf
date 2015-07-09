Meteor.methods({
  addCheckRoom: function(url){
    url = decodeURIComponent(url);
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({
        url: url,
        online: 0
      });
    }
  },
  addMessage: function(roomid, message, nick, user, sentTime){
    Messages.insert({
      roomid: roomid,
      nick: nick,
      user: user,
      message: message,
      date: sentTime
    },
    function(err){
      if (err){ return false; }
      return true;
    });
  },
  addEmail: function(email){
    var ipAllowLimit = 1000;
    var connIP = this.connection.clientAddress;
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var ipcount = Emails.find({ip: connIP}).count();
    var emailcount = Emails.find({email: email}).count();
    if (ipcount >= ipAllowLimit){ return false; }
    else if (!re.test(email)){ return false; }
    else if (emailcount!==0){ return true; }
    else{
      Emails.insert({
        email: email,
        ip: connIP
      },
      function(err){
        if (err){ return false; }
        console.log("Email ("+email+") added...");
        return true;
      });
    }
  }
});
