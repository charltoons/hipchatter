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
var ownerId;

describe('Rooms -- BREAD', function(){

    // BROWSE
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

    // ADD
    describe('Create room', function(){
        
        // Set scope for the responses
        var err, room;

        // Make the request
        // Make it private cause of the restriction of removing users
        before(function(done){
            hipchatter.create_room({name : settings.disposable_room}, function(_err, _room){
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
            hipchatter.create_room({name: settings.disposable_room}, function(err){
                expect(err.message).to.equal('Another room exists with that name.');

                done();
            });
        });
    });

    

    // READ
    describe('Get room', function(){
        
        // Set scope for the responses
        var err, room;

        // Make the request
        before(function(done){
            hipchatter.get_room(settings.disposable_room, function(_err, _room){
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

    // EDIT
    describe('Update room', function(){        
        // Set scope for the responses        
        var err, status;
        // Make the request
        before(function(done){            
            hipchatter.update_room( { 
                name: settings.disposable_room, 
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

    // DELETE
    describe('Delete room', function(){
        
        // Set scope for the responses
        var err;

        // Make the request
        before(function(done){
            hipchatter.delete_room(settings.disposable_room, function(_err){
                err = _err;
                done();
            });
        });
        it('should not return an error', function(){
            expect(err).to.be.null;
        });
    });



});