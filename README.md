# x

## Description

This library provides a promise orriented wrapper around XMLHttpRequest. Its primary purpose is to easily handle the
conversion of the response into the desired format.

## Usage

```javascript
  import x from 'x'
  import proto from 'proto'
  
  // Pass the protobuf class for automatic deserialization
  let req = x.proto("https://www.example.com", {
    proto: proto.Message,
  });
  
  // Get promise from request
  let pp = req.getPromise();
  pp.then((_req) => {
    // Response would be the deserialized protobuf message
    console.log(_req.getResponse());
  });
  
  // Automatically parse response body as json
  req = x.json("https://www.example.com");
  
  req.getPromise().then((_req) => { 
    // JSON Result
    console.log(_req.getResponse());
  });
```

## Options
| Options | Description |
| ------- | ----------- |
| convert | Provide a custom conversion handler |
| data | Pass data to be posted as body |   
| headers | Provide custom headers |
| method | Set the HTTP Method |
| requestedWith | Toggle whether add "X-Requested-With"="XMLHttpRequest" to headers |
| responseType | Set the xhr response type |
| timeout | Provide the timeout duration |
| url | Set the url to call |
