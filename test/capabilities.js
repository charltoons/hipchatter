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

/** ENDPOINTS **/
describe('Capabilities', function(){

    // Get capabilities
    describe('Get capabilities', function(){

        var err, capabilities;

        // Make the request
        before(function(done){
            hipchatter.capabilities(function(_err, _capabilities){
                err = _err;
                capabilities = _capabilities;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return capabilities', function(){
            expect(capabilities).to.have.property('capabilities');
        });
    });
});