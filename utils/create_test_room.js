// Make sure the API Credentials are present
try { var settings = require(__dirname+"/../test/settings.json"); } 
catch (e) { console.error('Create test/settings.json and populate with your credentials.'.red);}

var colors = require('colors')

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);

// Create a room to run tests from
hipchatter.create_room({name : settings.test_room}, function(err, room){
    if (err == null) console.log(('\n\nCreated "'+settings.test_room+'" room with id: '+room.id+'\n\n').green);
    else console.error('\n\nError creating room:'.red, err, '\n\n');
});

