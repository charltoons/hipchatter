//To run:
//      $ node example.js [your-hipchat-api-key] [word]
var Hipchatter = require('./hipchatter');

//pass the constructor a config object with your key
var key = process.argv[2];
var notify_key = process.argv[3];
var hipchatter = new Hipchatter(key);

if (key === undefined || notify_key === undefined) {
    console.error('Please include your API key and Notification API key as command line arguments.');
    console.error('eg. node example.js 123456789abcdef 987654321fedcba');
    process.exit(1);
}

//sample method
hipchatter.rooms(function(err, rooms){
    if (err) console.log(err);
    console.log(rooms);
});

hipchatter.history('HipChatter', function(err, rooms){
    console.log(rooms);
});

hipchatter.notify('HipChatter', '<code>Such Notifications. Many HipChat. Wow.</code>', notify_key, function(err, result){
    if (err == undefined) console.log(err);
    else console.log(results);
});

