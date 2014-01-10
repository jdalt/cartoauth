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
var markers = [];

/*** UI Functions ***/
// Normally I would use angular or jquery to do the event binding and DOM
// updating but this was relatively simple so I went with native DOM.

// Use anonymous functions for callbacks to capture request data within
// closures.
window.doSearch = function() {
  var query = document.querySelector('#map-search').value;
  showLoadingMessage();
  request.get('twitter/search')
    .query({q: query})
    .end( function(error, res) {
      var twitterData = JSON.parse(res.body);
      if(error || !twitterData.statuses || twitterData.statuses.length == 0) {
        showErrorMessage(error);
        return;
      }
      buildSearchTweets(twitterData.statuses, query);
    });
}

window.lookupTimeline = function(idString, screenName) {
  showLoadingMessage();
  currentTimelineUserName = screenName;
  request.get('twitter/timeline/' + idString)
    .end(function( error, res) {
      if(error || !res.body) {
        showErrorMessage(error);
        return;
      }
      var tweets = JSON.parse(res.body);
      buildTimelineTweets(tweets, screenName);
    });
}

window.panTo = function(markerIndex) {
  var marker = markers[markerIndex];
  if(marker != null) {
    marker.openPopup();
    map.panTo(marker.getLatLng());
  }
}

window.backToTweets = function() {
  if(currentSearch) {
    buildSearchTweets(currentSearch.tweets, currentSearch.query);
  }
}

var tweetContainer = document.querySelector('#tweet-container');
var currentSearch;
function buildSearchTweets(tweets, query) {
  currentSearch = { tweets: tweets, query: query};
  var tweetHtml = buildTweets(tweets, true);
  tweetContainer.innerHTML = searchTemplate({ query: query, tweet_html: tweetHtml });
}

function buildTimelineTweets(tweets, screenName) {
  var tweetHtml = buildTweets(tweets, false);
  tweetContainer.innerHTML = timelineTemplate({ screen_name: currentTimelineUserName, tweet_html: tweetHtml });
}

function buildTweets(tweetList, isSearch) {
  var tweetHtml = "";
  destroyMarkers();
  tweetList.forEach( function(tweet) {
    var markerIndex;
    if(tweet.geo) {
      var marker = L.marker(tweet.geo.coordinates).bindPopup(tweet.text).addTo(map).openPopup();
      markerIndex = markers.push(marker) - 1;
      console.log(markerIndex);
    }
    tweetHtml += tweetTemplate({ tweet: tweet, is_search: isSearch, marker_index: markerIndex});
  });
  return tweetHtml;
}

function destroyMarkers() {
  markers.forEach( function(item) {
    map.removeLayer(item);
    item = null;
  });
  markers = [];
}

function showLoadingMessage() {
  tweetContainer.innerHTML = '<h2>Loading</h2><img id="loader" src="images/loading.gif" />';
}

function showErrorMessage(error) {
  console.log(error);
  tweetContainer.innerHTML = "<h2>No Results.</h2>";
}

// TODO: refactor to a single getTemplate method with consistent addressing.

// We'll use the mustache delimiter to keep ejs from parsing frontend templates.
_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};
var tweetTemplateText = document.querySelector('#tweet-template').innerHTML;
var tweetTemplate = _.template(tweetTemplateText);

var searchTemplateText = document.querySelector('#search-template').innerHTML;
var searchTemplate = _.template(searchTemplateText);

var timelineTemplateText = document.querySelector('#timeline-template').innerHTML;
var timelineTemplate = _.template(timelineTemplateText);
