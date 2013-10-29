//To run:
//      $ node example.js [your-hipchat-api-key] [word]

var Hipchatter = require('./hipchatter');
    
//pass the constructor a config object with your key
var key = process.argv[2];
var hipchatter = new Hipchatter(key);

//sample method
hipchatter.rooms(function(err, rooms){
    console.log(err);
});