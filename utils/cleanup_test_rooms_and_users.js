var settings = require(__dirname+"/../test/settings.json");
var needle = require('needle')
var colors = require('colors')

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);


// Unconditionally delete all test and disposable rooms and users
// Don't really care what happens on the return.
// Maybe we will someday, who knows?
hipchatter.delete_user(settings.test_user.email, function(err){});
hipchatter.delete_user(settings.disposable_user.email, function(err){});
hipchatter.delete_room(settings.test_room, function(err){});
hipchatter.delete_room(settings.disposable, function(err){});