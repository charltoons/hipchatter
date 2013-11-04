//To run:
//      $ node example.js [your-hipchat-api-key] [word]

var Hipchatter = require('./hipchatter');
    
//pass the constructor a config object with your key
var key = process.argv[2];
var hipchatter = new Hipchatter(key);

//sample method
// hipchatter.rooms(function(err, rooms){
//     if (err) console.log(err);
//     console.log(rooms);
// });

hipchatter.history('Projeqt Command Test', function(err, rooms){
    console.log(rooms);
});