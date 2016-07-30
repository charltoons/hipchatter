var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var colors = require("colors");

// Make sure the API Credentials are present
try { var settings = require(__dirname+"/settings.json"); } 
catch (e) { console.error('Create test/settings.json and populate with your credentials.'.red);}

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter = new Hipchatter(settings.apikey, settings.endpoint);

describe('Rooms -- notifications', function(){

    // Send room notification
    describe('Room notification', function(){

        it('should throw an error if no object is passed', function(done){
            hipchatter.notify(settings.test_room, function(err, response, body){
                expect(err.message).to.contain('options object to the notify function');
                done();
            });
        });

        //Sample room notification
        it('should not return an error on valid request', function(done){
            hipchatter.notify(settings.test_room, 
                {
                    message: "Test Message from Mocha", 
                    token: settings.room_token
                }, function(err, response){
                    expect(err).to.be.null;
                    done();
                }
            );
        });

        //Convenience
        it('should still support the convenience syntax', function(done){
            hipchatter.notify(settings.test_room, "Test Message from Mocha", settings.room_token, function(err, response){
                expect(err).to.be.null;
                done();
            });
        });
    });
});