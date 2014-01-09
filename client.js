var L = require('leaflet'),
  request = require('superagent'),
  _ = require('underscore');

// Leaflet map configuration.
var map = L.map('map').setView([40,-90], 5);
L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
  key: 'BC9A493B41014CAABB98F0471D759707',
  styleId: 22677
}).addTo(map);
L.Icon.Default.imagePath = 'images';

window.doSearch = function() {
  var query = document.querySelector('#map-search').value;
  request.get('twitter/search')
    .query({q: query})
    .end(handleSearch);
}

function handleSearch(error, res) {
  // TODO: handle error
  console.log(JSON.parse(res.body));
  var twitterData = JSON.parse(res.body);
  if(!twitterData.statuses || twitterData.statuses.length == 0) {
    // TODO: handle error
    console.log('twitter did not return any statuses');
    return;
  }
  var tweetContainer = document.querySelector('#tweet-container');
  tweetContainer.innerHTML = "";
  twitterData.statuses.forEach( function(item) {
    tweetContainer.innerHTML += createTweetElement(item);
  });
}

// We'll use the mustache delimiter to keep ejs from parsing frontend templates.
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
var templateText = document.querySelector('#tweet-template').innerHTML;
var tweetTemplate = _.template(templateText);
function createTweetElement(tweet) {
  return tweetTemplate({ tweet: tweet });
}
