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
var DEBUG = true;

//  Hipchatter functions
Hipchatter.prototype = {

    // Get all rooms
    // https://www.hipchat.com/docs/apiv2/method/get_all_rooms
    rooms: function(callback){
        this.request('get', 'room', function(err, results){
            if (err) callback(err);
            else callback(err, results.items);
        });
    },

    // Get history from room
    // Takes either a room id or room name as a parameter
    // https://www.hipchat.com/docs/apiv2/method/view_history
    history: function(room, callback){
        this.request('get', 'room/'+room+'/history', callback);
    },

    // Get emoticon(s)
    //
    // https://www.hipchat.com/docs/apiv2/method/get_all_emoticons
    // params: {
    //     start-index: 0,
    //     max-results: 100,
    //     type: 'all'
    // }
    // 
    // https://www.hipchat.com/docs/apiv2/method/get_emoticon
    //
    // params = 10;
    // params = 'fonzie';
    //
    emoticons: function(params, callback){
        if (arguments.length === 1) {
            callback = params;
            this.request('get', 'emoticon', function(err, results){
                if (err) callback(err);
                else callback(err, results.items);
            });
        } else if (arguments.length === 2) {
            var arg = arguments[0];
            if (typeof arg === 'number' || typeof arg === 'string') {
                // get emoticon by id or shortcut
                return this.get_emoticon(arg, callback);
            } else if (typeof arg === 'object') {
                // get all emoticons based on specified params
                // still playing around with how to do this
                var options = 
                {
                    'start-index': 'start-index' in arg ? arg['start-index'] : 0,
                    'max-results': 'max-results?' in arg ? arg['max-results'] : 100,
                    'type': 'type' in arg ? arg['type'] : 'all',
                };
                this.request('get', 'emoticon', options, function(err, results){
                    if (err) callback(err);
                    else callback(err, results.items);
                });
            }
        }
    },

    get_emoticon: function(id, callback) {
        this.request('get', 'emoticon/' + id, function(err, results){
            if (err) callback(err);
            else callback(err, results.items);
        });
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
            this.request('post', 'room/'+room+'/notification', {message: message, token: token}, callback);
        }
        else if (typeof options != 'object' && typeof options == 'function') {
            options(true, "Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification");
        }
        else if (!options.hasOwnProperty('message') || (!options.hasOwnProperty('token'))) {
            callback(true, "Message and Room Notification token are required.");
        }
        else this.request('post', 'room/'+room+'/notification', options, callback);
    },
    create_webhook: function(room, options, callback){
        if (typeof options != 'object' && typeof options == 'function') {
            options(true, "Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification");
        }
        else if (!options.hasOwnProperty('url') || (!options.hasOwnProperty('event'))) {
            callback(true, "URL and Event are required.");
        }
        else this.request('post', 'room/'+room+'/webhook', options, callback);
    },
    get_webhook: function(room, id, callback){
        this.request('get', 'room/'+room+'/webhook/'+id, callback);
    },
    webhooks: function(room, callback){
        this.request('get', 'room/'+room+'/webhook', callback);
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
    // Not Yet Implemented by HipChat
    // set_topic: function(room, topic, callback){
    //     this.request('room/'+room+'/topic', {topic: topic}, callback);
    // },

    /** HELPERS **/

    // Generator API url
    url: function(rest_path, query, alternate_token){
        var BASE_URL = API_ROOT + escape(rest_path) + '?auth_token=';
        var queryString = function(query) {
            var query_string = '';
            for (var key in query) {
                query_string += ('&' + key + '=' + query[key]);
            }
            return query_string;
        };
        if (arguments.length === 1) {
            var url = BASE_URL + this.token;
            if (DEBUG) console.log('URL REQUEST: ', url);
            return url;
        }
        if (arguments.length === 2) {
            if (typeof query === 'object') {
                // do object stuff
                var url = BASE_URL + this.token + queryString(query);
                if (DEBUG) console.log('URL REQUEST: ', url);
                return url;
            } else {
                // do string stuff
                alternate_token = query;
                var token = (alternate_token == undefined) ? this.token : alternate_token;
                var url = BASE_URL + token;
                if (DEBUG) console.log('URL REQUEST: ', url);
                return url;
            }
        } else if (arguments.length === 3) {
            var token = (alternate_token == undefined)? this.token : alternate_token;
            var url = BASE_URL + token + queryString(query);
            if (DEBUG) console.log('URL REQUEST: ', url);
            return url;
        }
    },

    // TODO: refactor this function into get and post
    // Make a request
    // type: required
    // path: required
    // payload: optional
    // callback: required
    request: function(type, path, payload, callback){
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

        if (type.toLowerCase() === 'get') {
            if (arguments.length === 3) {
                callback = payload;
                needle.get(this.url(path), requestCallback);
            } else if (arguments.length === 4) {
                needle.get(this.url(path, payload), requestCallback);
            }
        } else if (type.toLowerCase() === 'post') {
            if (arguments.length === 3) {
                callback = payload;
                needle.post(this.url(path), requestCallback);
            } else if (arguments.length === 4) {
                // Else, if payload is an object of data, then submit POST request
                var url = (payload.hasOwnProperty('token'))? this.url(path, payload.token) : this.url(path);
                needle.post(url, payload, {json: true}, requestCallback);
            }
        }

        // Else something went wrong
        else { callback(true, 'Invalid use of the hipchatter.request function.'); }
    }
    /** END HELPERS **/
}

module.exports = Hipchatter;