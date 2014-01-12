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
   
   before( function() {
     mockMiddleware(app, "session", mockSessionWithToken);
   });

   after( function() {
     restoreMiddleware(app, mockSessionWithToken);
   });

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

describe('Going to the /twitter/timeline page and searching', function () {
 it('should return a json feed of recent tweets', function (done) {
   this.timeout(10000);

   before( function() {
     mockMiddleware(app, "session", mockSessionWithToken);
   });

   after( function() {
     restoreMiddleware(app, mockSessionWithToken);
   });

   request(app)
     .get('/twitter/search?q=Node')
     .end(function (err, res) {
       var data = JSON.parse(res.body);
       request(app)
       .get('/twitter/timeline/' + data.statuses[0].user.id)
       .expect(200)
       .expect('Content-Type', /json/)
       .end(function (err, res) {
         should.not.exist(err);
         res.body.length.should.be.above(7); // min length json res {"a":1}
         done();
       });
     });

 });
});

/*** Helpers ***/

function urlQString(str) {
  return str.split('?')[1];
}
// These are the test tokens generated in the twitter dev console
var sessionData = {
  oauth_access_token: '1173904848-TuDZLMQdvvXmAu9m7WGBFhCwDWpjKZqEdiZBvC3',
  oauth_access_token_secret: 'cuwVkYJF6sEI10p2879ZYBmfD4VpywTnjOrnRhuxkoT1Z' 
};
var mockSessionWithToken = mockSession(sessionData);

// Mock connect session middleware.
function mockSession(sessionProperties) { 
  // Return a named function (important for removing mock) with the desired
  // session data in it. Returning a function allows us to insert whatever
  // session data we want.
  var mockSession = function mockSession(req, res, next) { 
    req.session = sessionProperties;
    next(); 
  }
  return mockSession;
}

// Replace middleware in app with a 'mock' function handler.
var originalMiddleware = {};
function mockMiddleware(app, middlewareName, mock) {
  // app.stack is the ordered set of connect/express middleware
  app.stack.forEach(function(item) {
    if(item.handle.name == middlewareName) {
      // Save the original middleware in an object literal keyed to the
      // function name of the mocked middleware. This is why we need to name
      // mock middleware.
      originalMiddleware[mock.name] = item.handle;
      item.handle = mock;
    }
  });
}

// Replace middleware in app with a 'mock' function handler.
function restoreMiddleware(app, mock) {
  // app.stack is the ordered set of connect/express middleware
  app.stack.forEach(function(item) {
    if(item.handle.name == mock.name) {
      item.handle = originalMiddleware[mock.name];
      item.handle.name = "mock" + middleware;
    }
  });
}
