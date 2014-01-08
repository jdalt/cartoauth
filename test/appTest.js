var request = require('supertest'),
  app = require('../app.js').app,
  should = require('should'),
  qs = require('querystring');

function urlQString(str) {
  return str.split('?')[1];
}

describe('Going to the /twitter/login page', function () {
 it('should redirect to twitter api authorize page', function (done) {
   this.timeout(5000);
   request(app)
     .get('/twitter/login')
     .expect(302)
     .end(function (err, res) {
       should.not.exist(err);
       var paramHash = qs.parse(urlQString(res.headers.location));
       paramHash['oauth_token'].should.not.be.null;
       paramHash['oauth_token'].length.should.be.above(35);
       done();
     });
 });
});
