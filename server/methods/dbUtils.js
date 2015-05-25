Meteor.methods({
  addCheckRoom: function(url){
    var rec = Rooms.find({url: url});
    if (rec.count() == 0){
      Rooms.insert({
        url: url,
        online: 0,
        swp: 0,
        swp_cnt: 0,
        swp_voters: ["try"]
      });
    }
  },
  addVoteRoom: function(vote, url, userid){
    var rmdat = Rooms.find({url: url}).fetch();
    var swpvoters = rmdat[0].swp_voters;
    if (swpvoters.indexOf(userid)==-1){
      swpvoters.push(userid);
      var swpcnt = rmdat[0].swp_cnt;
      var currentswp = rmdat[0].swp;
      swpcnt++;
      currentswp+=vote;
      Rooms.update({url: url}, {$set: {swp_voters: swpvoters, swp_cnt: swpcnt, swp: currentswp}});
      // remove this
      console.log(Rooms.find({url: url}).fetch());
    }
    else{ console.log("already voted"); }
  },
  addMessage: function(roomid, message, nick, user){
    Messages.insert({
      roomid: roomid,
      nick: nick,
      user: user,
      message: message,
      date: new Date()
    });
  }
});
