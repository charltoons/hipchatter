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

describe('Rooms -- webhooks', function(){

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