var OAuth = require('oauth').OAuth,
  express = require('express'),
  app = exports.app = express();

app.use(express.cookieParser());
app.use(express.session({
  secret  : "omgHeavingHippoRageVeloSupra"
}));

console.log('smoke on the water');

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/twitter/login', function(req, res){
  var oauth = twitterOAuth();
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if(checkError(error, res)) return;

    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;
    req.session.oa = oauth;

    res.redirect("https://api.twitter.com/oauth/authorize?oauth_token="+oauth_token);
  });
});

app.get('/twitter/callback', function(req, res){
  var oauth = twitterOAuth();
    oauth.getOAuthAccessToken(
    req.session.oauth_token, 
    req.session.oauth_token_secret, 
    req.param('oauth_verifier'), 
    function(error, oauth_access_token, oauth_access_token_secret, results2) {
      if(checkError(error, res)) return;
      
      // store the access token in the session
      req.session.oauth_access_token = oauth_access_token;
      req.session.oauth_access_token_secret = oauth_access_token_secret;
      res.redirect("/twitter/search");
  });
  
});

app.get('/twitter/search', function(req, res){
  var oauth = twitterOAuth();
  oauth.getProtectedResource(
    "https://api.twitter.com/1.1/search/tweets.json?q=asdf",
    "GET",
    req.session.oauth_access_token,
    req.session.oauth_access_token_secret,
    function(error, data, response) {
      if(checkError(error, res)) return;

      res.json(data);
    }
  );
});

function checkError(error, res) {
  if(error) {
    console.log(error);
    res.statusCode = 500;
    res.send('error');
    return true;
  }
  return false;
}

function twitterOAuth() {
  var oauth = new OAuth( 'https://api.twitter.com/oauth/request_token',
                      'https://api.twitter.com/oauth/access_token',
                      'GRaDX5TBlPNEZMEeuFFobg',
                      '9JC8QFadrvNPRuiNFE0KQlaMKsKH4FF0qbCx3o',
                      '1.0A',
                      'http://localhost:3000/twitter/callback',
                      'HMAC-SHA1');
  return oauth;
}

app.listen(3000);
