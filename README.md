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
````bash
    npm install hipchatter --save
````

In your project's js file:
````javascript
    var Hipchatter = require('hipchatter');
    var hipchatter = new Hipchatter(your_auth_token [, hipchat_endpoint]);

    // this will list all of your rooms
    hipchatter.rooms(function(err, rooms){
        if(!err) console.log(rooms)
    });
````

Usage
----
````javascript
    hipchatter.<endpoint>(params, callback(err, response){
        console.log(response);
    });
````

- `<endpoint>` is the hipchatter function you are using.
- `params` are the parameter required by the function
- `err` error object if there is an error, null otherwise
- `response` the direct response from the HipChat API (JSON)

Documentation
-------------

### hipchatter.capabilities
Returns the capabilities descriptor for HipChat.

**Parameters:** None

**Results:**
- `err`, error object if the request failed, null otherwise
- `capabilities`, an object containing the capabilities of the HipChat API

#### Usage
````javascript
hipchatter.capabilities(function(err, capabilities){
    console.log(capabilities);
});
````

### hipchatter.rooms
Returns all of the rooms you have access to.

**Parameters:** None 

**Results:** `err`, array of rooms
#### Usage
````javascript
hipchatter.rooms(function(err, rooms){
    console.log(rooms);
});
````

### hipchatter.get_room
Returns the details of a single room.

**Parameters:** `room` (string) - the room name or id

**Results:** 

- `err`, array of rooms
- `room_details`, an object of the rooms details

### hipchatter.create_room
Creates a new room.

**Parameters:** 

- `params` (object) - Required. Options for the new room.
    - `'guest_access': <bool>` - Optional. Whether or not to enable guest access for this room. Defaults to false.
    - `'name': <string>` - Required. Name of the room
    - `'owner_user_id': <string>` - User ID or email address of the room's owner.
    - `'privacy': <string>` - Whether the room is available for access by other users or not. (`public` or `private`)


**Results:** 

- `err`, array of rooms
- `room_details`, an object of the rooms details

#### Usage
````javascript
hipchatter.create_room({name: 'Such Room'}, function(err, room){
    console.log(room);
});
````

### hipchatter.delete_room
Delete a room.

**Parameters:** 

- `room_name` (string) - Required. The name of the new room.


**Results:** 

- `err`

#### Usage
````javascript
hipchatter.delete_room('Such Room', function(err){
    if(!err) console.log('"Such Room" successfully deleted.');
});
````

### hipchatter.history
The history of one room.

**Parameters:** `room` (string) — the room name or id

**Results:** `err`, history (object) — the history object, the messages are in history.items (array)
#### Usage
````javascript
hipchatter.history('Hipchatter Room', function(err, history){
    // print the last message
    console.log(history.items[items.length-1].message);
});
````

### hipchatter.emoticons
Returns up to 100 emoticons.
> [HipChat API reference](https://www.hipchat.com/docs/apiv2/method/get_all_emoticons)

**Parameters:** 

- `param` (object) - Optional. query string parameters (optional)
    - `'start-index': <int>` - Optional. The start index for the result set. Defaults to `0`.
    - `'max-results': <int>` - Optional. The maximum number of results. Defaults to `100`.
    - `'type': <string>` - Optional. The type of emoticons to get. Defaults to `'all'`.
- `param` (int) - Optional. id for single emoticon.
- `param` (string) - Optional. shortcut for single emoticon.

**Results:** `err`, response (array: list of emoticons) (object: single emoticon)
#### Usage
````javascript
// default: returns array of all emoticons
hipchatter.emoticons(function(err, emoticons){
    console.log(emoticons);
});

hipchatter.emoticons({'start-index': 20, 'max-results': 40, 'type': 'group'}, function(err, emoticons){
   console.log(emoticons); 
});

hipchatter.emoticons(34, function(err, emoticon){
    console.log(emoticon);
});

hipchatter.emoticons('fonzie', function(err, emoticon){
    console.log(emoticon);
});
````

### hipchatter.get_emoticon
Get an emoticon by id or shortcut.
> [HipChat API reference](https://www.hipchat.com/docs/apiv2/method/get_emoticon)

**Parameters:**

- `param` (int) - Required. id for single emoticon.
or
- `param` (string) - Required. shortcut for single emoticon.

**Results:** `err`, response (object) - single emoticon details
#### Usage
````javascript
hipchatter.get_emoticon(34, function(err, emoticon){
    console.log(emoticon);
});

hipchatter.get_emoticon('fonzie', function(err, emoticon){
    console.log(emoticon);
});
}
````

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

**Results:** `err`

#### Usage
````javascript
hipchatter.notify('Hipchatter Room', 
    {
        message: 'Hello World',
        color: 'green',
        token: '<room notification token>'
    }, function(err){
        if (err == null) console.log('Successfully notified the room.');
});
````
    
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

**Results:** `err`

#### Usage
````javascript
hipchatter.create_webhook('Hipchatter Room', 
    {
        url: 'http://yourdomain.com',
        event: 'room_message'
    }, function(err, webhook){
        if (err == null) console.log('Successfully created webhook id:'+webhook.id+'.');
});
````

### hipchatter.get_webhook
Get the details of a specific webhook.

**Parameters:**

- `room` (string) — the room name or id
- `webhook_id` (string) - the id for the webhook that was returned from `create_webhook`

**Results:** `err`, `webhook_info`

#### Usage
````javascript
hipchatter.get_webhook('Hipchatter Room', '12345', function(err, hook){
        console.log(hook);
});
````

### hipchatter.webhooks
Get all webhooks for a room.

**Parameters:** `room` (string) — the room name or id

**Results:** `err`, `webhooks` (array)

#### Usage
````javascript
hipchatter.webhooks('Hipchatter Room', function(err, hooks){
    console.log(hooks);
});
````
### hipchatter.delete_webhook
Remove a webhook.

**Parameters:**

- `room` (string) - the room name or id
- `webhook_id` (string) - the id for the webhook that was returned from `create_webhook`

**Results:** `err`

#### Usage
````javascript
hipchatter.deleted_webhook('Hipchatter Room', '12345', function(err){
        if (err == null) console.log('Webhook sucessfully deleted');
});
````

### hipchatter.delete\_all_webhooks
A convenience function to delete all webhooks associated with a room.

**Parameters:** `room` (string) - the room name or id

**Results:** `err`

#### Usage
````javascript
hipchatter.delete_all_webhooks('Hipchatter Room', function(err){
    if (err == null) console.log('All webhooks sucessfully deleted');
});
````

### hipchatter.set_topic
Set the topic of a room.

**Parameters:** 

- `room` (string) - Required. The room name or id.
- `topic` (string) - Required. The topic that this room will be set to.

**Results:** `err`

#### Usage
````javascript
hipchatter.set_topic('Hipchatter Room', 'We Are All Talking About This', function(err){
    if (err == null) console.log('New Topic Set');
});
````

TODO
----
- [] Get all tests to pass
- [] Migrate docs to the [wiki](https://github.com/charltoons/hipchatter/wiki)
- [] Error events for things like rate limits
- [] Addon helpers
- [] Add support for `expand` (https://www.hipchat.com/docs/apiv2/expansion)
- [] Get the tests to check if the required stubs exist before running

How to Test
-----------
- Clone this repo
- Copy `/test/settings.example.json` to `/test/settings.json`
- Fill out your creds
- `npm install`
- `grunt stub` which creates the test room and test user
- `npm test`
