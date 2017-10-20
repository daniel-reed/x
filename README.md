# x

## Description

This library provides a wrapper around XMLHttpRequest. Its primary purpose is to easily handle conversion of the
response into the desired format.

## Usage

It is recommended to interact through the provided promise, not by overriding onSuccess, OnError, etc...

```javascript
  import x from 'x'
  import ProtoLibrary from 'ProtoLibrary'
  
  let req = x.proto("https://www.example.com", {
    proto: ProtoLibrary.ProtoMessage,
  });
  
  // Get promise form request
  let pp = req.getPromise();
  pp.then((result) => {
    // result == req
    // Response would be the deserialized protobuf message
    console.log(result.getResponse());
  });
  
  // Receive promise back directly
  let jp = x.json("https://www.example.com", {
    returnType: "promise"
  });
  
  jp.then((result) => {
    // Deserialized Json
    console.log(result.getResponse());
  });
```

## Options
| Options | Description |
| ------- | ----------- |
| onSuccess | Override the onSuccess handler |
| onError | Override the onError handler |   
| onAbort | Override the onAbort handler |
| onTimeout | Override the onTimeout handler |
| convert | Provide a custom conversion handler |
| proto | Provide the protobuf class you wish to deserialize |
| returnType | set to "promise" to get a promise back instead of the request |
