var OAuth = require('oauth').OAuth;

// Reading the domain through an environment variable. This will need to be setup 
// in the environment being deployed to or the callback from twitter will fail.
var domain = process.env.DOMAIN;
if(!domain) {
  console.log('Domain environment variable not set. Defaulting to localhost.');
  domain = "localhost:3000";
}
var callbackUrl = 'http://'+domain+'/twitter/callback';
console.log(callbackUrl);

var twitterAuth = function() {
  var oauth = new OAuth( 'https://api.twitter.com/oauth/request_token',
                      'https://api.twitter.com/oauth/access_token',
                      'GRaDX5TBlPNEZMEeuFFobg',
                      '9JC8QFadrvNPRuiNFE0KQlaMKsKH4FF0qbCx3o',
                      '1.0A',
                      callbackUrl,
                      'HMAC-SHA1');

  function search(query, accessToken, accessTokenSecret, callback) {
    oauth.getProtectedResource(
      "https://api.twitter.com/1.1/search/tweets.json?q=" + query,
      "GET",
      accessToken,
      accessTokenSecret,
      callback
    );
  }

  function timeline(user_id, accessToken, accessTokenSecret, callback) {
    oauth.getProtectedResource(
      "https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=" + user_id + "&count=10",
      "GET",
      accessToken,
      accessTokenSecret,
      callback
    );
  }

  function authorizeUrl(token) {
    return "https://api.twitter.com/oauth/authorize?oauth_token="+token;
  }

  oauth.authorizeUrl = authorizeUrl;
  oauth.search = search;
  oauth.timeline = timeline;
  return oauth;
}

exports.Auth = twitterAuth;
