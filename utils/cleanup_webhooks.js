var settings = require(__dirname+"/../test/settings.json");
var needle = require('needle')
var colors = require('colors')

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);

hipchatter.webhooks(settings.test_room, function(err, response){
    if (err !== null) {

        // A room can't have webhooks if it doesn't exist
        if (err.message == 'Room not found') return;

        console.error(err);
        return;
    }
    var webhooks = response.items;
    if (webhooks.length == 0) console.log('No webhooks for this room'.green)
    else console.log('Found '+webhooks.length+' for this room.');

    //for each webhook
    for (var i=0; i<webhooks.length; i++){
        var url = webhooks[i].links.self+'?auth_token='+settings.apikey;
        console.log(url);
        needle.delete(url, {}, function(e, r, b){
        });
    }
});
