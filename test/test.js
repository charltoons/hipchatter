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
        });
    });

    // Send room notification
    describe('Room notification', function(){

        it('should throw an error if no object is passed', function(done){
            hipchatter.notify(settings.test_room, function(err, response, body){
                expect(err).to.be.true;
                expect(response).to.contain('options');
                done();
            });
        });

        it('should throw an error if required options aren\'t passed', function(done){

           hipchatter.notify(settings.test_room, {message: "No Auth token"}, function(err, response){
                expect(err).to.be.true;
                expect(response).to.contain('token');
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