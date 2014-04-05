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
var ownerId;

describe('Rooms -- extras', function(){

    // Check if room exists
    describe('Room exists', function(){

        it('should return true if the room exists', function(done){
            hipchatter.room_exists(settings.test_room, function(err, exists){
                expect(err).to.be.null
                expect(exists).to.be.true;
                done();
            });
        });
        it('should return false if the room does not exist', function(done){

            // dependent on the previous delete_room test
            hipchatter.room_exists(settings.disposable_room, function(err, exists){
                expect(err).to.be.null
                expect(exists).to.be.false;
                done();
            });
        });
    });
});