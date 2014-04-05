var settings = require(__dirname+"/../test/settings.json");
var needle = require('needle')
var colors = require('colors')

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);

hipchatter.webhooks(settings.test_room, function(err, response){
    if (response.items.length == 0) console.log('No webhooks found'.green);
    else console.log(response.items);
});