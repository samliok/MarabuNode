const { Level } = require('level')
const db = new Level('db', { valueEncoding: 'json' })
const bootsrapping_peers = ["149.28.220.241:18018", "149.28.204.235:18018", "139.162.130.195:18018"]
const canonicalize = require('canonicalize');
const semver = require('semver');
const json = {
  from_account: '543 232 625-3',
  to_account: '321 567 636-4',
  amount: 500,
  currency: 'USD',
};
const acceptable_version = '0.8.x';
const hello_message = {
  type: 'hello',
  version: '0.8.0',
  agent: 'sam liokumovich node client 0.8',
};
const hello_formatted = canonicalize(hello_message);
get_peers = { "type": "getpeers" }
const get_peers_fornatted = canonicalize(get_peers);

// Include Nodejs' net module.
const Net = require('net');
const {disconnect} = require('process');
// The port on which the server is listening.
const port = 18018;

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Net.createServer();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
  console.log(
    `Server listening for connection requests on socket localhost:${port}`
  );
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function (socket) {
  console.log("You are connecting to Sam's Marabu Node!");

  // Now that a TCP connection has been established, the server can send data to
  // the client by writing to its socket.
  socket.write(`${hello_formatted}\n`);
  socket.write(`${get_peers_fornatted}\n`);
  // The server can also receive data from the client by reading from its socket.
  socket.on('data', function (chunk) {
    const parsed = chunk.toString();
    // sent_hello = true
    // db.get('key 1', function(err, value) {    
    //   if (err) {  
    //     sent_hello = false
    //   }  else {
    //     console.log('value:', value);  
    //   }
    // });
    // if (!sent_hello) {
    if (true) {
      // check for valid json
      var try_parse;
      try {
        try_parse = JSON.parse(parsed);
      } catch (e) {
        sendError(socket, 'Invalid format: json is required');
        // end connection
        socket.end();
        return;
      }
      // check for valid hello message
      // check for type: hello and version 0.8.x
      if (!('type' in try_parse) || !('version' in try_parse)) {
        // send an error
        sendError(socket, 'no type or version provided');
        socket.end();
      }
      if (try_parse['type'] != 'hello') {
        sendError(socket, 'incorrect "type" message');
        socket.end();
      }
      // check version numbers
      // use sermver https://www.npmjs.com/package/semver
      version = try_parse['version'];
      if (!semver.satisfies(version, acceptable_version)) {
        // send an error
        sendError(socket, 'invalid version number');
        socket.end();
      }
      // goodstanding_connections.push('client name');
    }
    // add to goodstanding_connections
    // const value = db.get('a')

    console.log(`Data received from client: ${parsed}`);
  });

  // When the client requests to end hohhthe TCP connection with the server, the server
  // ends the connection.
  socket.on('end', function () {
    console.log('Closing connection with the client');
  });

  // Don't forget to catch error, for your own sake.
  socket.on('error', function (err) {
    console.log(`Error: ${err}`);
  });
});

function sendError(socket, message) {
  error_json = getErrorMessage(message);
  socket.write(`${canonicalize(error_json)}\n`);
}

function getErrorMessage(message) {
  return {type: 'error', error: message};
}
