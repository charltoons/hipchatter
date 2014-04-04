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
                expect(err.message).to.equal('Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification');
                done();
            });
        });

        it('should throw an error if required options aren\'t passed', function(done){

           hipchatter.notify(settings.test_room, {message: "No Auth token"}, function(err, response){
                expect(err.message).to.equal('Message and Room Notification token are required.');
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