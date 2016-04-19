var app = require('./index');
var assert = require('assert');
var superagent = require('superagent');

describe('server', function() {
  var server;

  beforeEach(function() {
    server = app().listen(3000);
  });

  afterEach(function() {
    server.close();
  });

  it('prints all  by collection', function(done) {
    superagent.get('http://localhost:3000/', function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      // TODO
      done();
    });
  });
});
