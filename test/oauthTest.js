describe('OAuth1.0A',function(){
  var OAuth = require('oauth');

  it('should be able to call twitter api with our auth credentials',function(done){
    this.timeout(10000);
    var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      'GRaDX5TBlPNEZMEeuFFobg',
      '9JC8QFadrvNPRuiNFE0KQlaMKsKH4FF0qbCx3o',
      '1.0A',
      null,
      'HMAC-SHA1'
    );

    oauth.get(
      'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      '1173904848-TuDZLMQdvvXmAu9m7WGBFhCwDWpjKZqEdiZBvC3', //test user token
      'cuwVkYJF6sEI10p2879ZYBmfD4VpywTnjOrnRhuxkoT1Z', //test user secret            
      function (e, data, res){
        if (e) console.error(e);        
        console.log(require('util').inspect(data));
        done();      
      }
    ); 
  });
});
