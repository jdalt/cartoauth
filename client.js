var L = require('leaflet');

var map = L.map('map').setView([40,-90], 5);

L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
  key: 'BC9A493B41014CAABB98F0471D759707',
  styleId: 22677
}).addTo(map);

L.Icon.Default.imagePath = 'images';

module.exports = {
  Leaflet: L,
  map: map
};

