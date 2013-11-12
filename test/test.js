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
    describe('Get all rooms', function(){
        it('should not return an error', function(done){
            hipchatter.rooms(function(err, rooms){
                expect(err).to.be.null;
                done();
            });
        });
        it('should return a list of rooms', function(done){
            hipchatter.rooms(function(err, rooms){
                expect(rooms).to.be.ok;
                expect(rooms).to.not.be.empty;
                done();
            });
        });
        it('should return rooms that have an id and name, at least', function(done){
            hipchatter.rooms(function(err, rooms){
                expect(rooms[0]).to.have.property('name');
                expect(rooms[0]).to.have.property('id');
                done();
            });
        });
    });
});