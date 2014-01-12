###Usage
This application is deployed to heroku at http://intense-meadow-2711.herokuapp.com/

To use the application login via Twitter's OAuth1 service and authroize the app.

You can then search twitter for any string and tweets matching your query will be returned. With the returned tweets you can look at the timeline of any user who wrote it. If the tweet was geolocated, it will be added to the map.

###Technologies
Cartoauth is built with Node using express and oauth on the server and leaflet and superagent on the client (built using browserify). Testing is done with mocha and supertest.
