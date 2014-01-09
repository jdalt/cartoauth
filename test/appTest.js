var request = require('supertest'),
  app = require('../server.js').app,
  should = require('should'),
  qs = require('querystring'),
  app;

describe('Going to the /twitter/login page', function () {
 it('should redirect to twitter api authorize page', function (done) {
   this.timeout(5000);
   request(app)
     .get('/twitter/login')
     .expect(302)
     .end(function (err, res) {
       should.not.exist(err);
       var paramHash = qs.parse(urlQString(res.headers.location));
       paramHash.oauth_token.should.not.be.null;
       paramHash.oauth_token.length.should.be.above(35);
       done();
     });
 });
});

describe('Going to the /twitter/search page and searching', function () {
 it('should return a json feed of recent tweets', function (done) {
   this.timeout(5000);

   // These are the test tokens generated in the twitter dev console
   var sessionData = {
     oauth_access_token: '1173904848-TuDZLMQdvvXmAu9m7WGBFhCwDWpjKZqEdiZBvC3',
     oauth_access_token_secret: 'cuwVkYJF6sEI10p2879ZYBmfD4VpywTnjOrnRhuxkoT1Z' 
   };
   mockMiddleware(app, "session", mockSession(sessionData));

   request(app)
     .get('/twitter/search?q=Node')
     .expect(200)
     .expect('Content-Type', /json/)
     .end(function (err, res) {
       should.not.exist(err);
       res.body.length.should.be.above(7); // min length json res {"a":1}
       done();
     });
 });
});


/*** Helpers ***/

function urlQString(str) {
  return str.split('?')[1];
}

// Mock connect session middleware.
function mockSession(sessionProperties) { 
  var mockSession = function(req, res, next) { 
    req.session = sessionProperties;
    next(); 
  }
  return mockSession;
}

// Replace middleware in app with a 'mock' function handler.
function mockMiddleware(app, middleware, mock) {
  // app.stack is the ordered set of connect/express middleware
  app.stack.forEach(function(item) {
    if(item.handle.name == middleware) {
      item.handle = mock;
    }
  });
}
