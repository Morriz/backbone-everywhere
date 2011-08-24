# node-jsonrpc2

This is a JSON-RPC server and client library for node.js <http://nodejs.org/>,
the V8 based evented IO framework.

## Install

To install node-jsonrpc2 in the current directory, run:

    npm install jsonrpc2

## Usage

Firing up an efficient JSON-RPC server becomes extremely simple:

``` javascript
var rpc = require('jsonrpc2');

function add(first, second) {
    return first + second;
}
rpc.expose('add', add);

rpc.listen(8000, 'localhost');
```

And creating a client to speak to that server is easy too:

``` javascript
var rpc = require('jsonrpc2');
var sys = require('sys');

var client = rpc.getClient(8000, 'localhost');

client.call('add', [1, 2], function(result) {
    sys.puts('1 + 2 = ' + result);
});
```

To learn more, see the examples directory, peruse test/jsonrpc-test.js, or
simply "Use The Source, Luke".

More documentation and development is on its way.
