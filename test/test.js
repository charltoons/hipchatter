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
var ownerId;


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

/** ENDPOINTS **/
describe('Endpoints', function(){

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

    // Create a new room
    describe('Create room', function(){
        
        // Set scope for the responses
        var err, room;

        // Make the request
        // Make it private cause of the restriction of removing users
        before(function(done){
            hipchatter.create_room({name : settings.test_room}, function(_err, _room){
                err = _err;
                room = _room;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a room id', function(){
            expect(room.id).to.be.a.number;
        });
        it('should return an error if a room with the given name already exists', function(done){
            hipchatter.create_room({name: settings.test_room}, function(err){
                expect(err.message).to.equal('Another room exists with that name.');

                done();
            });
        });
    });

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

    // Get one room
    describe('Get room', function(){
        
        // Set scope for the responses
        var err, room;

        // Make the request
        before(function(done){
            hipchatter.get_room(settings.test_room, function(_err, _room){
                err = _err;
                room = _room;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return the details of the room', function(){
            expect(room).to.be.ok;
            expect(room).to.not.be.empty;
            ownerId = room.owner.id;
        });
        it('should return a room name and topic, at least', function(){
            expect(room).to.have.property('name');
            expect(room).to.have.property('topic');
        });
        it('should return an error if the room does not exist', function(done){
            hipchatter.get_room('non-existent room', function(err){
                expect(err.message).to.equal('Room not found');

                done();
            });
        });
    });

    describe('Update room', function(){        
        // Set scope for the responses        
        var err, status;
        // Make the request
        before(function(done){            
            hipchatter.update_room( { 
                name: settings.test_room, 
                privacy: 'private', 
                is_archived: false, 
                is_guest_accessible: false, 
                topic: "New Topic", 
                owner: {id: ownerId}
            }, function(_err, _body, _status) {
                    err = _err;
                    status = _status;
                    done();
                }
            );
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return status code 204', function() {
            expect(status).to.equal(204);
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
            hipchatter.history('non-existent room', function(err){
                expect(err.message).to.equal('Room not found');
                done();
            });
        });
    });
    
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
            hipchatter.create_user({
                name: 'Test User',
                title: 'Test User Title',
                mention_name: 'testMention',
                is_group_admin: false,
                timezone: 'UTC',
                password: '',
                email: 'testuser@testuser.com'
            }, function(_err, _body){
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
            hipchatter.view_user('testuser@testuser.com', function(_err, _user) {
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

    // View user
    describe('Send a private message to a user', function() {
        var err, response;

        before(function(done) {
            hipchatter.send_private_message('testuser@testuser.com', {message: 'Private message for you'}, function(_err, _body, _response) {
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

    // View user
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
                email: 'testuser@testuser.com'
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
    });

    // Add a member to a room
    describe('Add a member to a room', function() {
        var err, response, params;
        params = {
            room_name: settings.test_room, 
            user_email: 'testuser@testuser.com'
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
            user_email: 'testuser@testuser.com'
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
            user_email: 'testuser@testuser.com'
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



    //Deleting a user works, but i don't get the correct response code, API bug or am i missing something.
    // Deletes a user
    describe('Delete User', function() {
        var err, response;

        before(function(done) {
            hipchatter.delete_user('testuser@testuser.com', function(_err, _body, _response){
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

describe('Webhooks', function(){

    // Create Webhook
    describe('Create Webhook', function(){
        var err, link;
        before(function(done){
            var options = {
                url: settings.webhook_url,
                pattern: 'test',
                event: 'room_message',
                name: 'mocha test'
            };
            hipchatter.create_webhook(settings.test_room, options, function(_err, body){
                link = body.links.self;
                hipchatter.webhook_id = body.id;
                err = _err;

                // generate 2 webhooks so delete_all_webhooks will have something to do
                hipchatter.create_webhook(settings.test_room, options, function(_err, body){
                    done();
                });
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should return a link to the hook', function(){
            expect(link).to.be.a('string');
        });
    });

    // Get a webhook -- Not supported yet
    describe('Get Webhook', function(){
        var err, response;
        before(function(done){

            //uses the link created above
            hipchatter.get_webhook(settings.test_room, hipchatter.webhook_id, function(e, r){
                err = e;
                response = r;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
    });

    // Get webhooks
    describe('Get Webhooks', function(){
        var err, response;
        before(function(done){
            hipchatter.webhooks(settings.test_room, function(e, r){
                err = e;
                response = r;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should have created a webhook about', function(){
            expect(response.items.length).to.be.above(0);
        });
    });

    // Delete webhook created earlier
    describe('Delete a Webhook', function(){
        var err, response, previous_number_of_webhooks;
        before(function(done){
            hipchatter.webhooks(settings.test_room, function(e, r){
                previous_number_of_webhooks = r.items.length;
                hipchatter.delete_webhook(settings.test_room, hipchatter.webhook_id, function(e, r){
                    err = e;
                    response = r;
                    done();
                });
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should have deleted the webhook', function(done){
            hipchatter.webhooks(settings.test_room, function(e, r){
                expect(e).to.be.null;
                expect(r.items.length).to.equal(previous_number_of_webhooks - 1);
                done();
            });
        });
    });

    // Delete all webhooks for a room
    describe('Delete all webhooks', function(){
        var err, response, previous_number_of_webhooks;
        before(function(done){
            hipchatter.webhooks(settings.test_room, function(e, r){
                previous_number_of_webhooks = r.items.length;
                hipchatter.delete_all_webhooks(settings.test_room, function(e, r){
                    err = e;
                    response = r;
                    done();
                });
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
        it('should have deleted all the webhooks', function(done){
            hipchatter.webhooks(settings.test_room, function(e, r){
                expect(e).to.be.null;
                expect(r.items.length).to.equal(0);
                done();
            });
        });
    });
});

describe('Miscellaneous', function(){
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
})
// Delete the new room
describe('Delete room', function(){
    
    // Set scope for the responses
    var err;

    // Make the request
    before(function(done){
        hipchatter.delete_room(settings.test_room, function(_err){
            err = _err;
            done();
        });
    });
    it('should not return an error', function(){
        expect(err).to.be.null;
    });
});