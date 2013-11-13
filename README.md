HipChatter
=============

**Node.js wrapper for the HipChat API (v2)**

See the full HipChat API v2 Documentation at [https://www.hipchat.com/docs/apiv2](https://www.hipchat.com/docs/apiv2)

You can generate an API token by going to [https://hipchat.com/account/api](https://hipchat.com/account/api). You must have admin access.

Note: This is a work-in-progress, and will improve over time.

[![NPM](https://nodei.co/npm/hipchatter.png?downloads=true)](https://nodei.co/npm/hipchatter/)

***



How to Install
--------------
In your project folder:

    npm install hipchatter --save
    
In your project's js file:

    var Hipchatter = require('hipchatter');
    var hipchatter = new Hipchatter(your_auth_token);
    
    // this will list all of your rooms
    hipchatter.rooms(function(err, rooms){
        if(!err) console.log(rooms)
    });

***

Documentation
-------------

### Function Reference
- [rooms](#rooms)
- [history](#history)
- [notify](#notify)

### [Rooms](https://www.hipchat.com/docs/apiv2/method/get_all_rooms)
Returns all of the rooms you have access to.

#### Parameters
- None
#### Results
- err (true or null)
- rooms (array) — an array of the rooms
#### Usage

    hipchatter.rooms(function(err, rooms){
        console.log(rooms);
    });

### [History](https://www.hipchat.com/docs/apiv2/method/view_history)
The history of one room.

#### Parameters
- room (string) — the room name or id
#### Results
- err (true or null)
- history (object) — the history object, the messages are in history.items (array)
#### Usage

    hipchatter.history('Hipchatter Room', function(err, history){
        // print the last message
        console.log(history.items[items.length-1].message);
    }

### [Notify](https://www.hipchat.com/docs/apiv2/method/send_room_notification)
Send a room notification.

#### Parameters
- room (string) — the room name or id
- options (object)
    - message (string) - Required. Message to be sent
    - token (string) - Required. The Room notification auth token. You can generate one by going to HipChat.com > Rooms tab > Click the room you want > Select Tokens [BETA] on the left-hand side > generate a new token
    - color (string) - yellow (default), red, green, purple, gray, random
    - message_format - html (default), text
    - notify (boolean) - false (default), true
#### Results
- err (true or null)
- err_response (string)
#### Usage

    hipchatter.notify('Hipchatter Room', 
        {
            message: 'Hello World',
            color: 'green',
            token: '<room notification token>'
        }, function(err){
            if (err == null) console.log('Successfully notified the room.');
    });

***

How to Test
-----------
Clone this repo, then

    npm install --save-dev
    mocha