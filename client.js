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

/*** UI Functions ***/

// Use anonymous functions for callbacks to capture request data within
// closures.
window.doSearch = function() {
  var query = document.querySelector('#map-search').value;
  request.get('twitter/search')
    .query({q: query})
    .end( function(error, res) {
      var twitterData = JSON.parse(res.body);
      if(!twitterData.statuses || twitterData.statuses.length == 0) {
        // TODO: handle error
        console.log('twitter did not return any statuses');
        return;
      }
      buildSearchTweets(twitterData.statuses, query);
    });
}

window.lookupTimeline = function(idString, screenName) {
  currentTimelineUserName = screenName;
  request.get('twitter/timeline/' + idString)
    .end(function( error, res) {
      if( !error && res.body) {
        // TODO: handle error
        var tweets = JSON.parse(res.body);
        buildTimelineTweets(tweets, screenName);
      }
    });
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
  tweetList.forEach( function(item) {
    tweetHtml += tweetTemplate({ tweet: item, is_search: isSearch});
  });
  return tweetHtml;
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
