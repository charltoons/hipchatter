// Make sure the API Credentials are present
try { var settings = require(__dirname+"/../test/settings.json"); } 
catch (e) { console.error('Create test/settings.json and populate with your credentials.'.red);}

var colors = require('colors')

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);

// Create a user to run tests from
hipchatter.create_user(settings.test_user, function(err, body){
    if (err == null) console.log(('\n\nCreated "'+settings.test_user.name+'\n\n').green);
    else console.error('\n\nError creating user:'.red, err, '\n\n');
});