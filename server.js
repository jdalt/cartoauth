var twitter = require('./lib/twitterAuth.js').Auth(),
  express = require('express'),
  app = exports.app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.cookieParser());
app.use(express.session({
  secret: "omgHeavingHippoRageVeloSupra"
}));

console.log('smoke on the water');

app.get('/', function(req, res){
    res.render('home.html');
});

app.get('/twitter/login', function(req, res){
  twitter.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if(checkError(error, res)) return;

    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;

    res.redirect(twitter.authorizeUrl(oauth_token));
  });
});

app.get('/twitter/callback', function(req, res){
  twitter.getOAuthAccessToken(
    req.session.oauth_token, 
    req.session.oauth_token_secret, 
    req.param('oauth_verifier'), 
    function(error, oauth_access_token, oauth_access_token_secret, userData) {
      if(checkError(error, res)) return;

      console.log(userData);
      
      // store the access token in the session
      req.session.oauth_access_token = oauth_access_token;
      req.session.oauth_access_token_secret = oauth_access_token_secret;
      res.redirect("/");
  });
});

app.get('/twitter/search', function(req, res){
  twitter.search(
    req.param('q'), 
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

app.listen(3000);
