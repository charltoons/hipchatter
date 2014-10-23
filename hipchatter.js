//  Dependencies
var needle = require('needle');
var async = require('async');

//  Hipchatter constructor
var Hipchatter = function(token, api_root) {  
    this.token = token;
    this.api_root = api_root || 'https://api.hipchat.com/v2/';
}

// Turns logging on for debugging
// var DEBUG = true;
var DEBUG = false;

//  Hipchatter functions
Hipchatter.prototype = {

    // Get capabilities
    // https://www.hipchat.com/docs/apiv2/method/get_capabilities
    capabilities: function(callback) {
        // Make a request without an auth token, since only unauthorized users are allowed to call this resource
        this.request('get', 'capabilities', {'token': ''}, callback);
    },

    // Updates a room
    // https://www.hipchat.com/docs/apiv2/method/update_room
    update_room: function(params, callback) {
        this.request('put', 'room/'+params.name, params, callback)
    },

    // Create a new room
    // https://www.hipchat.com/docs/apiv2/method/create_room
    create_room: function(params, callback){
        this.request('post', 'room', params, callback);
    },

    // Delete a room
    // https://www.hipchat.com/docs/apiv2/method/delete_room
    delete_room: function(room, callback){
        this.request('delete', 'room/'+room, callback);
    },

    // Get all rooms
    // https://www.hipchat.com/docs/apiv2/method/get_all_rooms
    rooms: function(callback){
        this.request('get', 'room', function(err, results){
            if (err) callback(err);
            else callback(err, results.items);
        });
    },

    // Get room
    // https://www.hipchat.com/docs/apiv2/method/get_room
    get_room: function(room, callback){
        this.request('get', 'room/'+room, callback);
    },
    // Add a member to a room
    // https://www.hipchat.com/docs/apiv2/method/add_member
    add_member: function(params, callback) {
        this.request('put', 'room/'+params.room_name+'/member/'+params.user_email, callback);
    },
    // Delete a member from a room
    // https://www.hipchat.com/docs/apiv2/method/remove_member
    delete_member: function(params, callback) {
        this.request('delete', 'room/'+params.room_name+'/member/'+params.user_email, callback);
    },
    // Invite a user to a room.
    // https://www.hipchat.com/docs/apiv2/method/invite_member
    invite_member: function(params, reason, callback) {
        this.request('post', 'room/'+params.room_name+'/invite/'+params.user_email, reason, callback);
    },
    // Get history from room
    // Takes either a room id or room name as a parameter
    // https://www.hipchat.com/docs/apiv2/method/view_history
    history: function(room, callback){
        this.request('get', 'room/'+room+'/history', callback);
    },
    // Get all users
    // https://www.hipchat.com/docs/apiv2/method/get_all_users
    users: function(callback) {
        this.request('get', 'user', function(err, results) {
            if(err) callback(err);
            else callback(err, results.items)
        });
    },

    // View user details
    // https://www.hipchat.com/docs/apiv2/method/view_user
    view_user: function(user, callback) {
        this.request('get', 'user/'+user, callback);
    },
    // Update a user
    // https://www.hipchat.com/docs/apiv2/method/update_user
    update_user: function(params, callback) {
        this.request('put', 'user/'+params.email, params, callback)
    },
    // Creates a user
    // https://www.hipchat.com/docs/apiv2/method/create_user
    create_user: function(params, callback) {
        this.request('post', 'user', params, callback);
    },    
    // Deletes a user
    // https://www.hipchat.com/docs/apiv2/method/delete_user
    delete_user: function(user, callback) {
        this.request('delete', 'user/'+user, callback);
    },
    // Send a private message to a user
    // https://www.hipchat.com/docs/apiv2/method/private_message_user
    send_private_message: function(user, message, callback) {
        this.request('post', 'user/'+user+'/message', message, callback);
    },

    // Get emoticons
    //
    // https://www.hipchat.com/docs/apiv2/method/get_all_emoticons
    // params: {
    //     'start-index': 0,
    //     'max-results': 100,
    //     'type': 'all'
    // }
    //
    // or
    // 
    // Get emoticon by shortcut or id
    // https://www.hipchat.com/docs/apiv2/method/get_emoticon
    //
    // params = 34;
    // params = 'fonzie';
    //
    emoticons: function(params, callback){
        if (arguments.length === 1) { // only supplied a callback function
            callback = params;
            this.request('get', 'emoticon', function(err, results){
                if (err) callback(err);
                else callback(err, results.items);
            });
        } else if (arguments.length === 2) { // contains some type of param
            if (typeof params === 'number' || typeof params === 'string') {
                // get emoticon by id or shortcut
                return this.get_emoticon(params, callback);
            } else if (typeof params === 'object') {
                // get all emoticons based on specified params
                // resort to default params if input param doesn't exist or is incorrectly typed
                var query = {
                    'start-index': 'start-index' in params ? params['start-index'] : 0,
                    'max-results': 'max-results' in params ? params['max-results'] : 100,
                    'type': 'type' in params ? params['type'] : 'all',
                };
                this.request('get', 'emoticon', query, function(err, results){
                    if (err) callback(err);
                    else callback(err, results.items);
                });
            }
        }
    },

    // Get emoticon by id or shortcut
    // https://www.hipchat.com/docs/apiv2/method/get_emoticon
    //
    // param = 34; // id
    // param = 'fonzie'; // shortcut
    //
    get_emoticon: function(param, callback) {
        this.request('get', 'emoticon/' + param, callback);
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
        if (typeof options == 'string') {
            var message = arguments[1];
            var token = arguments[2];
            var callback = arguments[3];
            this.request('post', 'room/'+room+'/notification', {message: message, token: token}, callback);
        }
        else if (typeof options != 'object' && typeof options == 'function') {
            options(new Error('Must supply an options object to the notify function containing at least the message. See https://www.hipchat.com/docs/apiv2/method/send_room_notification'));
        }
        else if (!options.hasOwnProperty('message') ) {
            callback(new Error('Message is required.'));
        }
        else this.request('post', 'room/'+room+'/notification', options, callback);
    },
    create_webhook: function(room, options, callback){
        if (typeof options != 'object' && typeof options == 'function') {
            options(new Error('Must supply an options object to the notify function containing at least the message and the room notification token. See https://www.hipchat.com/docs/apiv2/method/send_room_notification'));
        }
        else if (!options.hasOwnProperty('url') || (!options.hasOwnProperty('event'))) {
            callback(new Error('URL and Event are required.'));
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
            if (!!error) callback(new Error('HipChat API Error.'));

            // HipChat returned an error or no HTTP Success status code
            else if (body.hasOwnProperty('error') || response.statusCode < 200 || response.statusCode >= 300){
                try { callback(new Error(body.error.message)); }
                catch (e) {callback(new Error(body)); }
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
            if (err) return callback(new Error(response));
            
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
            async.parallel(hookCalls, callback);
        });
    },
    set_topic: function(room, topic, callback){
        this.request('put', 'room/'+room+'/topic', {topic: topic}, callback);
    },

    /** EXTRAS **/
    // functions that are not part of the official HipChat API

    // Check if a room exists
    room_exists: function(room, callback){
        this.get_room(room, function(err, response){
            if(err === null){
                return callback(null, true);
            }
            else if (err.message == 'Room not found'){
                return callback(null, false);
            }
            else { 
                console.log(err)
                return callback(err)
            }
        });
    },

    /** HELPERS **/

    // Generator API url
    url: function(rest_path, query, alternate_token){
        // inner helpers
        var BASE_URL = this.api_root + escape(rest_path) + '?auth_token=';
        var queryString = function(query) {
            var query_string = '';
            for (var key in query) {
                query_string += ('&' + key + '=' + query[key]);
            }
            return query_string;
        };

        if (arguments.length === 1) { // only contains path
            var url = BASE_URL + this.token;
            if (DEBUG) console.log('URL REQUEST: ', url);
            return url;
        } else if (arguments.length === 2) { // contains query or alt token
            if (typeof query === 'object') { // query {}
                var url = BASE_URL + this.token + queryString(query);
                if (DEBUG) console.log('URL REQUEST: ', url);
                return url;
            } else { // alt token
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

    // Make a request
    // type: required - type of REST request ('get' or 'post' currently)
    // path: required - 
    // payload: optional - query string data for 'get', '' 
    // callback: required -      
    request: function(type, path, payload, callback){
        if (this.isFunction(payload)) { // No payload
            callback = payload;
            payload = {};
        }

        var requestCallback = function (error, response, body) {
            if (DEBUG) {console.log('RESPONSE: ', error, response, body);}

            // Connection error
            if (!!error) callback(new Error('HipChat API Error.'));

            // HipChat returned an error or no HTTP Success status code
            else if (body.hasOwnProperty('error') || response.statusCode < 200 || response.statusCode >= 300){
                try { callback(new Error(body.error.message)); }
                catch (e) {callback(new Error(body)); }
            }

            // Everything worked
            else {
                callback(null, body, response.statusCode);
            }
        };

        // GET request
        if (type.toLowerCase() === 'get') {
            var url = payload.hasOwnProperty('token') ? this.url(path, payload, payload.token) : this.url(path, payload);

            needle.get(url, requestCallback);

        // POST request
        } else if (type.toLowerCase() === 'post') {
            var url = payload.hasOwnProperty('token') ? this.url(path, payload.token) : this.url(path);

            needle.post(url, payload, {json: true, headers:{'Content-Type': 'application/json; charset=utf-8'}}, requestCallback);

        // PUT request 
        } else if (type.toLowerCase() === 'put') {
            needle.put(this.url(path), payload, {json: true, headers:{'Content-Type': 'application/json; charset=utf-8'}}, requestCallback);

        // DELETE request 
        } else if (type.toLowerCase() === 'delete') {
            needle.delete(this.url(path), {}, requestCallback);

        // otherwise, something went wrong   
        } else { 
            callback(new Error('Invalid use of the hipchatter.request function.'));
        }
    },

    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }
    /** END HELPERS **/
}

module.exports = Hipchatter;
