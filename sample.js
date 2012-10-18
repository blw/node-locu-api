var key = require('./key.json');

var LocuAPI = require('./lib/node-locu-api');
console.log(key.key);
var lapi = new LocuAPI({key: key.key});


var searchParams = {
    name : 'coffee'
  , locality : 'San Francisco'
};

var venueParams = {
    venue_id : 'f76e0639b43b7a14e2d1'
  , locality : 'San Francisco'
};

lapi.menu.search(searchParams, function (e, d) { 
	console.log(arguments);
});

lapi.menu.details(venueParams, function (e, d) {
    console.log(arguments);
});
