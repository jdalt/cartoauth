var OAuth = require('oauth').OAuth;

var twitterAuth = function() {
  var oauth = new OAuth( 'https://api.twitter.com/oauth/request_token',
                      'https://api.twitter.com/oauth/access_token',
                      'GRaDX5TBlPNEZMEeuFFobg',
                      '9JC8QFadrvNPRuiNFE0KQlaMKsKH4FF0qbCx3o',
                      '1.0A',
                      'http://localhost:3000/twitter/callback',
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

  function authorizeUrl(token) {
    return "https://api.twitter.com/oauth/authorize?oauth_token="+token;
  }

  oauth.authorizeUrl = authorizeUrl;
  oauth.search = search;
  return oauth;
}

exports.Auth = twitterAuth;
