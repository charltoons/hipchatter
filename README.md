HipChatter
=============

**Node.js wrapper for the HipChat API (v2)**

See the full HipChat API v2 Documentation at [https://www.hipchat.com/docs/apiv2](https://www.hipchat.com/docs/apiv2)

You can generate an API token by going to [https://hipchat.com/account/api](https://hipchat.com/account/api). You must have admin access.

Source is available at [http://github.com/charltoons/hipchatter.git](http://github.com/charltoons/hipchatter.git). Pull requests welcome!

Note: This is a work-in-progress, and will improve over time.

[![NPM](https://nodei.co/npm/hipchatter.png?downloads=true)](https://nodei.co/npm/hipchatter/)

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

Usage
----
    hipchatter.<endpoint>( params, callback(err, response){
        console.log(response);
    });

- `<endpoint>` is the hipchatter function you are using.
- `params` are the parameter requiree by the function
- `err` will be true if there's an error, null if there's not
- `response` the direct response from the HipChat API (JSON)

Documentation
-------------

### hipchatter.rooms
Returns all of the rooms you have access to.

**Parameters:** None 

**Results:** `err`, array of rooms)
#### Usage

    hipchatter.rooms(function(err, rooms){
        console.log(rooms);
    });

### hipchatter.history
The history of one room.

**Parameters:** `room` (string) — the room name or id

**Results:** `err`, history (object) — the history object, the messages are in history.items (array)
#### Usage

    hipchatter.history('Hipchatter Room', function(err, history){
        // print the last message
        console.log(history.items[items.length-1].message);
    }

### hipchatter.notify
Send a room notification.

**Parameters:**

- `room` (string) — the room name or id
- `options` (object)
    - **message** (string) - Required. Message to be sent
    - **token** (string) - Required. The Room notification auth token. You can generate one by going to HipChat.com > Rooms tab > Click the room you want > Select Tokens [BETA] on the left-hand side > generate a new token
    - **color** (string) - yellow (default), red, green, purple, gray, random
    - **message_format** - html (default), text
    - **notify** (boolean) - false (default), true

**Results:** `err`, `err_response`

#### Usage

    hipchatter.notify('Hipchatter Room', 
        {
            message: 'Hello World',
            color: 'green',
            token: '<room notification token>'
        }, function(err){
            if (err == null) console.log('Successfully notified the room.');
    });
    
### hipchatter.create_webhook
Create a webhook for HipChat to ping when a certain event happens in a room.

**Parameters:**

- `room` (string) — the room name or id
- `options` (object)
    - **url** - for HipChat to ping
    - **pattern** - regex to match message against
    - **event** - the event to listen for.
        - Valid values: `room_message`, `room_notification`, `room_exit`, `room_enter`, `room_topic_change`
    - **name** - name for this webhook

**Results:** `err`, `err_response`

#### Usage

    hipchatter.create_webhook('Hipchatter Room', 
        {
            url: 'http://yourdomain.com',
            event: 'room_message'
        }, function(err){
            if (err == null) console.log('Successfully created webhook.');
    });

### hipchatter.get_webhook
Get the details of a sepcific webhook.

**Parameters:**

- `room` (string) — the room name or id
- `webhook_id` (string) - the id for the webhook that was returned from `create_webhook`

**Results:** `err`, `webhook_info`

#### Usage

    hipchatter.get_webhook('Hipchatter Room', '12345', function(err, hook){
            console.log(hook);
    });

### hipchatter.webhooks
Get all webhooks for a room.

**Parameters:** `room` (string) — the room name or id

**Results:** `err`, `webhooks` (array)

#### Usage

    hipchatter.webhooks('Hipchatter Room', function(err, hooks){
        console.log(hooks);
    });

### hipchatter.delete_webhook
Remove a webhook.

**Parameters:**

- `room` (string) — the room name or id
- `options` (object)
    - **url** - for HipChat to ping
    - **pattern** - regex to match message against
    - **event** - the event to listen for.
        - Valid values: `room_message`, `room_notification`, `room_exit`, `room_enter`, `room_topic_change`
    - **name** - name for this webhook

**Results:** `err`, `err_response`

#### Usage

    hipchatter.create_webhook('Hipchatter Room', 
        {
            url: 'http://yourdomain.com',
            event: 'room_message'
        }, function(err){
            if (err == null) console.log('Successfully created webhook.');
    });

### hipchatter.delete\_all_webhooks
Create a webhook for HipChat to ping when a certain event happens in a room.

**Parameters:**

- **room** (string) — the room name or id
- **options** (object)
    - **url** - for HipChat to ping
    - **pattern** - regex to match message against
    - **event** - the event to listen for.
        - Valid values: `room_message`, `room_notification`, `room_exit`, `room_enter`, `room_topic_change`
    - **name** - name for this webhook

**Results:** `err`, `err_response`

#### Usage

    hipchatter.create_webhook('Hipchatter Room', 
        {
            url: 'http://yourdomain.com',
            event: 'room_message'
        }, function(err){
            if (err == null) console.log('Successfully created webhook.');
    });


How to Test
-----------
- Clone this repo
- Copy `/test/settings.example.json` to `/test/settings.json`
- Fill out your creds
- Then:

    `npm install
    mocha -t 5000`