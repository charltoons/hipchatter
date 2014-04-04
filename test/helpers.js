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
    hipchatter = new Hipchatter(settings.apikey, settings.endpoint);
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
    describe('url with query', function(){
        var query = {'start-index': 10, 'max-results': 50, 'type': 'group'};
        var url = hipchatter.url('emoticon', query);
        it('should return a valid URL with query strings', function(){
            expect(url).to.be.a('string');
            expect(url).to.contain(settings.apikey);
            expect(url).to.contain('hipchat');
            expect(url).to.contain('&start-index=10');
        });
    });
    describe('url with empty query', function(){
        var query = {};
        var url = hipchatter.url('emoticon', query);
        it('should return a valid URL', function(){
            expect(url).to.be.a('string');
            expect(url).to.contain(settings.apikey);
            expect(url).to.contain('hipchat');
            expect(url).to.not.contain('&');
        });
    });
});