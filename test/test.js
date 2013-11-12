var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var colors = require("colors");

// Make sure the API Credentials are present
try { var settings = require(__dirname+"/settings.json"); } 
catch (e) { console.error('Create test/settings.json and populate with your credentials.'.red);}

// Setup hipchatter
var Hipchatter = require(__dirname+'/../hipchatter.js');
var hipchatter;


describe('Creating hipchatter object', function(){
  describe('hipchatter', function(){
    hipchatter = new Hipchatter(settings.apikey);
    it('should exists and be an object', function(){
      expect(hipchatter).to.exist;
      expect(hipchatter).to.be.an('object');
      expect(hipchatter).to.be.instanceof(Hipchatter);
    });
  });
});


/** HELPERS **/
describe('Helpers', function(){
    describe('url default', function(){
        var url = hipchatter.url('room/history');
        it('should return a valid URL with the auth token', function(){
            expect(url).to.be.a('string');
            expect(url).to.contain(settings.apikey);
            expect(url).to.contain('hipchat');
        });
        alturl = hipchatter.url('room/history', 'exampletoken');
        it('should return a valid URL with the alternate token', function(){
            expect(alturl).to.be.a('string');
            expect(alturl).to.contain('exampletoken');
            expect(alturl).to.contain('hipchat');
        });
    });
});

/** ENDPOINTS **/
describe('Enpoints', function(){

    // Get all rooms
    describe('Get all rooms', function(){
        
        // Set scope for the responses
        var err, rooms;

        // Make the request
        before(function(done){
            hipchatter.rooms(function(_err, _rooms){
                err = _err;
                rooms = _rooms;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a list of rooms', function(){
            expect(rooms).to.be.ok;
            expect(rooms).to.not.be.empty;
        });
        it('should return rooms that have an id and name, at least', function(){
            expect(rooms[0]).to.have.property('name');
            expect(rooms[0]).to.have.property('id');
        });
    });

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
            hipchatter.history('non-existent room', function(_err, msg){
                err = _err;
                expect(msg).to.equal('Room not found');
                done();
            });
        })
    });
});