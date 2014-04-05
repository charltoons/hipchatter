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

describe('Rooms -- members', function(){

    // Add a member to a room
    describe('Add a member to a room', function() {
        var err, response, params;
        params = {
            room_name: settings.test_room, 
            user_email: settings.test_user.email
        };

        before(function(done) {
            hipchatter.add_member(params, function(_err, _body, _response) {
                err = _err;
                response = _response;
                done();
            });
        });

        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return status code 204 when the user is succesfully added to the room', function() {
            expect(response).to.equal(204);
        });
        
    });

    // Add a member to a room
    describe('Invite a member to a room', function() {
        var err, response, params;
        params = {
            room_name: settings.test_room, 
            user_email: settings.test_user.email
        };

        before(function(done) {
            hipchatter.invite_member(params, {reason: 'We wanted to invite you to this room'}, function(_err, _body, _response) {
                err = _err;
                response = _response;
                done();
            });
        });

        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return status code 204 when the user is succesfully invited to the room', function() {
            expect(response).to.equal(204);
        });
        
    });

     // Remove a member from a room
    describe('Remove a member from a room', function() {
        var err, response, params;
        params = {
            room_name: settings.test_room, 
            user_email: settings.test_user.email
        };

        before(function(done) {
            hipchatter.add_member(params, function(_err, _body, _response) {
                err = _err;
                response = _response;
                done();
            });
        });

        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return status code 204 when the user is succesfully removed from the room', function() {
            expect(response).to.equal(204);
        });
        
    });
});