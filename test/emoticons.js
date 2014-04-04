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

// Get emoticon(s)
describe('Emoticons', function(){
    describe('Get all emoticons', function(){
        // Set scope for the responses
        var err, emoticons;

        // Make the request
        before(function(done){
            hipchatter.emoticons(function(_err, _emoticons){
                err = _err;
                emoticons = _emoticons;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a list of emoticons', function(){
            expect(emoticons).to.be.ok;
            expect(emoticons).to.not.be.empty;
        });
        it('should return emoticons with required properties', function(){
            expect(emoticons[0]).to.not.be.empty;
            expect(emoticons[0]).to.have.property('id');
            expect(emoticons[0]).to.have.property('url');
            expect(emoticons[0]).to.have.property('links');
            expect(emoticons[0]).to.have.property('shortcut');
        });
    });
    describe('Get all emoticons with valid query', function(){
        // Set scope for the responses
        var err, emoticons;
        var options = {'max-results': 15};

        // Make the request
        before(function(done){
            hipchatter.emoticons(options, function(_err, _emoticons){
                err = _err;
                emoticons = _emoticons;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a list of emoticons', function(){
            expect(emoticons).to.be.ok;
            expect(emoticons).to.not.be.empty;
        });
        it('should return a list of 15 emoticons', function(){
            expect(emoticons).to.have.length(15);
        });
        it('should return emoticons with required properties', function(){
            expect(emoticons[0]).to.not.be.empty;
            expect(emoticons[0]).to.have.property('id');
            expect(emoticons[0]).to.have.property('url');
            expect(emoticons[0]).to.have.property('links');
            expect(emoticons[0]).to.have.property('shortcut');
        });
    });
    describe('Get all emoticons with invalid query', function(){
        // Hipchatter.emoticons should ignore invalid params
        // so this request should work without a problem

        // Set scope for the responses
        var err, emoticons;
        var options = {
            'puppets': 10, 
            'isCat': true
        };

        // Make the request
        before(function(done){
            hipchatter.emoticons(options, function(_err, _emoticons){
                err = _err;
                emoticons = _emoticons;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a list of emoticons', function(){
            expect(emoticons).to.be.ok;
            expect(emoticons).to.not.be.empty;
        });
        it('should return emoticons with required properties', function(){
            expect(emoticons[0]).to.not.be.empty;
            expect(emoticons[0]).to.have.property('id');
            expect(emoticons[0]).to.have.property('url');
            expect(emoticons[0]).to.have.property('links');
            expect(emoticons[0]).to.have.property('shortcut');
        });
    });
    describe('Get specific emoticon by id', function(){
        // Set scope for the responses
        var err, emoticon;

        // Make the request
        before(function(done){
            hipchatter.emoticons(34, function(_err, _emoticon){
                err = _err;
                emoticon = _emoticon;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a valid emoticon', function(){
            expect(emoticon).to.be.ok;
            expect(emoticon).to.not.be.empty;
        });
        it('should return an emoticon with required properties', function(){
            expect(emoticon).to.not.be.empty;
            expect(emoticon).to.have.property('id', 34);
            expect(emoticon).to.have.property('url');
            expect(emoticon).to.have.property('links');
            expect(emoticon).to.have.property('shortcut', 'menorah');
        });
    });
    describe('Get specific emoticon by shortcut', function(){
        // Set scope for the responses
        var err, emoticon;

        // Make the request
        before(function(done){
            hipchatter.emoticons('fonzie', function(_err, _emoticon){
                err = _err;
                emoticon = _emoticon;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a valid emoticon', function(){
            expect(emoticon).to.be.ok;
            expect(emoticon).to.not.be.empty;
        });
        it('should return an emoticon with required properties', function(){
            expect(emoticon).to.not.be.empty;
            expect(emoticon).to.have.property('id', 41842);
            expect(emoticon).to.have.property('url');
            expect(emoticon).to.have.property('links');
            expect(emoticon).to.have.property('shortcut', 'fonzie');
        });
    });
});