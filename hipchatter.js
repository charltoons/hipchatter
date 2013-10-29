//  Endpoints
var API_ROOT = 'https://api.hipchat.com/v2/';

//  Dependencies
var request = require('request');
var path = require('path');
  
//  Hipchatter constructor
var Hipchatter = function(token) {  
    this.token = token;
}

//  Hipchatter functions
Hipchatter.prototype = {

    // Get all rooms
    rooms: function(callback){
        request(this.url('room'), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(error, response, body);
                callback(null);
            }
            else callback(error, 'API connection error.');
        });
    },

    // Generator API url
    url: function(rest_path){
        return API_ROOT + '/' + rest_path +'?auth_token='+this.token;
    }
}

module.exports = Hipchatter;