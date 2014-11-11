var assert = require('assert');

suite('DomainUtils', function() {

  // getPrefix

  test('getPrefix1', function(done, server) {
    server.eval(function() {
      var domain = "http://www.google.com";
      Meteor.call("getPrefix", domain, function(err, res){
        emit('getPrefix', res);
      });
    });
    server.once('getPrefix', function(res) {
      assert.equal(res, "http://");
      done();
    });
  });

  test('getPrefix2', function(done, server) {
    server.eval(function() {
      var domain = "https://twitter.com/OguzGelal";
      Meteor.call("getPrefix", domain, function(err, res){
        emit('getPrefix', res);
      });
    });
    server.once('getPrefix', function(res) {
      assert.equal(res, "https://");
      done();
    });
  });

  test('getPrefix3', function(done, server) {
    server.eval(function() {
      var domain = "oguzgelal.com";
      Meteor.call("getPrefix", domain, function(err, res){
        emit('getPrefix', res);
      });
    });
    server.once('getPrefix', function(res) {
      assert.equal(res, null);
      done();
    });
  });

  // removePrefix

  test('removePrefix1', function(done, server) {
    server.eval(function() {
      var domain = "http://www.google.com";
      Meteor.call("removePrefix", domain, function(err, res){
        emit('removePrefix', res);
      });
    });
    server.once('removePrefix', function(res) {
      assert.equal(res, "www.google.com");
      done();
    });
  });

  test('removePrefix2', function(done, server) {
    server.eval(function() {
      var domain = "https://www.twitter.com/OguzGelal";
      Meteor.call("removePrefix", domain, function(err, res){
        emit('removePrefix', res);
      });
    });
    server.once('removePrefix', function(res) {
      assert.equal(res, "www.twitter.com/OguzGelal");
      done();
    });
  });

  test('removePrefix3', function(done, server) {
    server.eval(function() {
      var domain = "oguzgelal.com";
      Meteor.call("removePrefix", domain, function(err, res){
        emit('removePrefix', res);
      });
    });
    server.once('removePrefix', function(res) {
      assert.equal(res, "oguzgelal.com");
      done();
    });
  });

  // removeParams

  test('removeParams1', function(done, server) {
    server.eval(function() {
      var domain = "https://www.google.com.tr/search?safe=off&site=&source=hp&q=oguzgelal&oq=oguzgelal&gs_l=hp.3..0i10.1540.2320.0.2401.10.7.0.0.0.0.309.682.0j2j0j1.3.0....0...1c.1.58.hp..8.2.372.0.2zaDk9spuN0";
      Meteor.call("removeParams", domain, function(err, res){
        emit('removeParams', res);
      });
    });
    server.once('removeParams', function(res) {
      assert.equal(res, "www.google.com.tr");
      done();
    });
  });

  test('removeParams2', function(done, server) {
    server.eval(function() {
      var domain = "youtube.com/watch?v=B8hA0QtkSD4&list=TLHHsHsJz234k";
      Meteor.call("removeParams", domain, function(err, res){
        emit('removeParams', res);
      });
    });
    server.once('removeParams', function(res) {
      assert.equal(res, "youtube.com");
      done();
    });
  });

  test('removeParams3', function(done, server) {
    server.eval(function() {
      var domain = "http://cubic.fm/#!playlist/2188928947";
      Meteor.call("removeParams", domain, function(err, res){
        emit('removeParams', res);
      });
    });
    server.once('removeParams', function(res) {
      assert.equal(res, "cubic.fm");
      done();
    });
  });

  // getUrlParams

  test('getUrlParams1', function(done, server) {
    server.eval(function() {
      var domain = "youtube.com/watch?v=B8hA0QtkSD4&list=TLHHsHsJz234k";
      Meteor.call("getUrlParams", domain, function(err, res){
        emit('getUrlParams', res);
      });
    });
    server.once('getUrlParams', function(res) {
      assert.equal(res["v"], "B8hA0QtkSD4");
      assert.equal(res["list"], "TLHHsHsJz234k");
      done();
    });
  });

  test('getUrlParams2', function(done, server) {
    server.eval(function() {
      var domain = "http://www.oguzgelal.com";
      Meteor.call("getUrlParams", domain, function(err, res){
        emit('getUrlParams', res);
      });
    });
    server.once('getUrlParams', function(res) {
      assert.equal(res, null);
      done();
    });
  });

  test('getUrlParams3', function(done, server) {
    server.eval(function() {
      var domain = "youtube.com/watch?v=B8hA0QtkSD4";
      Meteor.call("getUrlParams", domain, function(err, res){
        emit('getUrlParams', res);
      });
    });
    server.once('getUrlParams', function(res) {
      assert.equal(res["v"], "B8hA0QtkSD4");
      done();
    });
  });


});
