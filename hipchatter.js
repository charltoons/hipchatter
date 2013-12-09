//  Endpoints
var API_ROOT = 'https://api.hipchat.com/v2/';

//  Dependencies
var needle = require('needle');
var async = require('async');
  
//  Hipchatter constructor
var Hipchatter = function(token) {  
    this.token = token;
}

// Turns logging on for debugging
// var DEBUG = true;
var DEBUG = false;

//  Hipchatter functions
Hipchatter.prototype = {

    // Get all rooms
    // https://www.hipchat.com/docs/apiv2/method/get_all_rooms
    rooms: function(callback){
        this.request('room', function(err, results){
            if (err) callback(err);
            else callback(err, results.items);
        });
    },

    // Get history from room
    // Takes either a room id or room name as a parameter
    // https://www.hipchat.com/docs/apiv2/method/view_history
    history: function(room, callback){
        this.request('room/'+room+'/history', callback);
    },

    // Uses the simple "Room notification" token
    // https://www.hipchat.com/docs/apiv2/method/send_room_notification

    // notify: function(room, message, token, callback){
    //     var data = {
    //         color: 'green',
    //         message: message
    //     }
    //     needle.post(this.url('room/'+room+'/message', token), data, {json:true}, function(error, res, body){
    //         if (!error && res.statusCode == 204) { callback(null, body); }
    //         else callback(error, 'API connection error.');
    //     });
    // },
    notify: function(room, options, callback){

        // convenience function notify(room, message, token, callback)
        if (typeof arguments[1] == 'string') {
            var message = arguments[1];
            var token = arguments[2];
            var callback = arguments[3];
            this.request('room/'+room+'/notification', {message: message, token: token}, callback);
        }
        else if (typeof options != 'object' && typeof options == 'function') {
            options(true, "Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification");
        }
        else if (!options.hasOwnProperty('message') || (!options.hasOwnProperty('token'))) {
            callback(true, "Message and Room Notification token are required.");
        }
        else this.request('room/'+room+'/notification', options, callback);
    },
    create_webhook: function(room, options, callback){
        if (typeof options != 'object' && typeof options == 'function') {
            options(true, "Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification");
        }
        else if (!options.hasOwnProperty('url') || (!options.hasOwnProperty('event'))) {
            callback(true, "URL and Event are required.");
        }
        else this.request('room/'+room+'/webhook', options, callback);
    },
    get_webhook: function(room, id, callback){
        this.request('room/'+room+'/webhook/'+id, callback);
    },
    webhooks: function(room, callback){
        this.request('room/'+room+'/webhook', callback);
    },
    delete_webhook: function(room, id, callback){
        needle.delete(this.url('room/'+room+'/webhook/'+id), null, function (error, response, body) {
            // Connection error
            if (!!error) callback(true, 'HipChat API Error.');

            // HipChat returned an error or no HTTP Success status code
            else if (body.hasOwnProperty('error') || response.statusCode < 200 || response.statusCode >= 300){
                try { callback(true, body.error.message); }
                catch (e) {callback(true, body); }
            }

            // Everything worked
            else {
                callback(null, body);
            }
        });
    },
    delete_all_webhooks: function(room, callback){
        var self = this;
        this.webhooks(room, function(err, response){
            if (err) return callback(true, response);
            
            var hooks = response.items;
            var hookCalls = [];
            for (var i=0; i<hooks.length; i++){
                // wrapper function to preserve context of hookId
                (function(hookId){
                    hookCalls[i] = function(done){
                        self.delete_webhook(room, hookId, done);
                    }
                })(hooks[i].id);
            }
            async.parallel(hookCalls, function(err, results){
                if (err) return callback(true, results);
                return callback(null, results);
            });
        });
    },
    //TODO Endpoints
    // Capabilities
    //// Get capabilities
    // Emoticons
    //// Get all emoticons
    //// Get emoticon
    // OAuth
    //// Generate Token
    // Rooms
    //// Create room
    //// Send room notification
    //// Get room
    //// Delete room
    //// Create webhook
    //// Get all webhooks
    //// Set topic
    //// Delete webhook
    //// Get webhook
    //// Invite User
    // Users
    //// Private message user
    //// Update user
    //// Delete user
    //// View User
    //// Create user
    //// Get all users

    /** HELPERS **/

    // Generator API url
    url: function(rest_path, alternate_token){
        var token = (alternate_token == undefined)? this.token : alternate_token;
        if(DEBUG) console.log('URL REQUEST: ', (API_ROOT + escape(rest_path) + '?auth_token=' + token));
        return API_ROOT + escape(rest_path) + '?auth_token=' + token;
    },

    // Make a request
    request: function(path, payload, callback){
        var requestCallback = function (error, response, body) {
            
            // Connection error
            if (!!error) callback(true, 'HipChat API Error.');

            // HipChat returned an error or no HTTP Success status code
            else if (body.hasOwnProperty('error') || response.statusCode < 200 || response.statusCode >= 300){
                try { callback(true, body.error.message); }
                catch (e) {callback(true, body); }
            }

            // Everything worked
            else {
                callback(null, body);
            }
        };

        // If the function was only called with a path and a callback
        if (typeof arguments[1] == 'function') {
            callback = arguments[1];
            needle.get(this.url(path), requestCallback);
        }

        // Else, if payload is an object of data, then submit POST request
        else if (typeof payload == 'object') {
            var url = (payload.hasOwnProperty('token'))? this.url(path, payload.token) : this.url(path);
            needle.post(url, payload, {json: true}, requestCallback);
        }

        // Else something went wrong
        else { callback(true, 'Invalid use of the hipchatter.request function.'); }
    }
    /** END HELPERS **/
}

module.exports = Hipchatter;