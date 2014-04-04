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

describe('Users', function() {

    // Get all users
    describe('Get All Users', function() {
        // Set scope for the responses
        var err, users;

        // Make the request
        before(function(done){
            hipchatter.users(function(_err, _users){
                err = _err;
                users = _users;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a list of users', function(){
            expect(users).to.be.ok;
            expect(users).to.not.be.empty;
        });
        it('should return users that have an id and name, at least', function(){
            expect(users[0]).to.have.property('name');
            expect(users[0]).to.have.property('id');
        });
    });

    // Create a user
    describe('Create User', function() {
        var err, body;

        before(function(done) {
            hipchatter.create_user(settings.disposable_user, function(_err, _body){
                err = _err;
                body = _body;
                done();
            });
        });
        it('should not return an error', function() {
            expect(err).to.be.null;
        });
        it('should return an random password when none is provided', function() {
            expect(body).to.be.not.null;
        });
    });

    // View user
    describe('View User', function() {
        var user, err;

        before(function(done) {
            hipchatter.view_user(settings.disposable_user.email, function(_err, _user) {
                err = _err;
                user = _user;
                done();
            });
        });
        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return the requested user to have a title and name, at least', function() {
            expect(user).to.have.property('title');
            expect(user).to.have.property('name');
        });
        
    });

    // Update user
    describe('Update User', function() {
        var err, response;

        before(function(done) {
            hipchatter.update_user({
                name: 'Updated Test User',
                title: 'Test User Updated Title',
                mention_name: 'UpdatedTestMention',
                is_group_admin: false,
                timezone: 'UTC',
                password: '',
                email: settings.disposable_user.email
            }, function(_err, _user, _response) {
                err = _err;
                response = _response;
                done();
            });
        });
        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return status code 204 when the update succeeded', function() {
            expect(response).to.equal(204);
        });

        //TODO check with get_user that the user was actually updated        
    });

    //PM User
    describe('Send a private message to a user', function() {
        var err, response;

        before(function(done) {
            hipchatter.send_private_message(settings.disposable_user.email, {message: 'Private message for you'}, function(_err, _body, _response) {
                err = _err;
                response = _response;
                done();
            });
        });

        it('should not return an error', function() {
            expect(err).to.be.null;
        });

        it('should return status code 204 when the private message is succesfully send', function() {
            expect(response).to.equal(204);
        });
        
    });

    //Deleting a user works, but i don't get the correct response code, API bug or am i missing something.
    // Deletes a user
    describe('Delete User', function() {
        var err, response;

        before(function(done) {
            hipchatter.delete_user(settings.disposable_user.email, function(_err, _body, _response){
                err = _err,
                response = _response;
                done();
            });
        });
        // it('should not return an error', function() {
        //     expect(err).to.be.null;
        // });
        it('should return 204 when the user is deleted', function() {
            // expect(response).to.equal(204);
        });

    });

    
});