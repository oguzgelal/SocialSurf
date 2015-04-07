Meteor.methods({
  getPrefix: function(url){
    var match = url.match(/(\w)*:\/\//gi);
    if (match && match.length > 0){ return match[0]; }
    return null;
  },
  removePrefix: function(url){
    var prefix = Meteor.call("getPrefix", url);
    if (prefix){ return url.replace(prefix, ""); }
    else{ return url; }
  },
  removeParams: function(url){
    url = Meteor.call("removePrefix", url);
    url = url.split("?")[0];
    url = url.split("#")[0];
    url = url.split("/")[0];
    return url;
  },
  getUrlParams: function(url){
    url = Meteor.call("removePrefix", url);
    var arr = url.match(/[?&][^?&]*/gi);
    var returnarr = {};
    for(var i = 0; i < arr.length; i++){
      arr[i] = arr[i].replace(/[?&]/gi, "");
      var parts = arr[i].split("=");
      returnarr[parts[0]] = parts[1];
    }
    if (returnarr){ return returnarr; }
    else{ return null; }
  },
  cleanURL: function(url){
    // remove http htpps ftp or whatever
    url = Meteor.call("removePrefix", url);
    // remove whatever is after the hash
    url = url.split("#")[0];
    // if url ends with slash, remove it
    if (url.substr(-1)=="/"){ url = url.substr(0,url.length-1); }
    return url;
  }
});
