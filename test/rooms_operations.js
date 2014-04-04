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

describe('Rooms -- operations', function(){

    // Get the history of a room
    describe('View history', function(){
        // Set scope for the responses
        var err, history;

        // Make the request
        before(function(done){
            hipchatter.history(settings.test_room, function(_err, _history){
                err = _err;
                history = _history;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return the correct history of the room', function(){
            expect(history).to.have.property('items');
            expect(history.items).to.not.be.empty;
            expect(history.items[0]).to.have.property('message');
        });
        it('should return an error if the room does not exist', function(done){
            hipchatter.history('non-existent room', function(err){
                expect(err.message).to.equal('Room not found');
                done();
            });
        });
    });
    describe('Set Topic', function(){
        it('should set the topic in the room', function(done){
            hipchatter.set_topic(settings.test_room, 'Test Topic', function(e, r){
                expect(e).to.be.null;
                hipchatter.get_room(settings.test_room, function(err, response){
                    expect(response.topic).to.equal('Test Topic');
                    done();
                });
            });
        });
    });
});