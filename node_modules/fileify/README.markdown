fileify
=======

Middleware for browserify to load non-js files like templates.

methods
=======

````javascript
var express = require('express'); // or connect, whatevs
var app = express.createServer();
var fileify = require('fileify');

var bundle = browserify();
bundle.use(fileify);
app.use(bundle)
````

fileify(name, dir, opts)
------------------------

Make the files in `dir` available through `require(name)`.

`require(name)` will then return the files hashed by filename.

fileify will do a recursive traversal of `dir` and return all the files
except for hidden ones unless you specify a callback for `opts.extension`.

Returns a middleware function with a '.end()' function to stop all the watches
in watch mode.

opts can have:

* watch - if true, update the fileified bundle when files change

* extension - a filter function, regexp, string extension, or array of
extensions to limit extensions to

If opts is not an object and not an array it will be interpreted as the
extension.


example
=======

simple/server.js

````javascript
var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname));
app.listen(8080);
console.log('Listening on 8080');

var browserify = require('browserify');
var bundle = browserify({
    require : { jquery : 'jquery-browserify' }
});
app.use(bundle);

var fileify = require('fileify');
bundle.use(fileify('files', __dirname + '/files'));
````

````html
<html>
  <head>
    <script type="text/javascript" src="/browserify.js"></script>
    <script type="text/javascript">
      var files = require('files')
      var $ = require('jquery');
      
      window.onload = function () {
        Object.keys(files).forEach(function (name) {
          var div = $('<div>').appendTo($('#files'));
          
          $('<div>')
            .text(name)
            .appendTo(div)
          ;
          $('<textarea>')
            .val(files[name])
            .appendTo(div)
          ;
        });
      };
    </script>
  </head>
  <body>
    <div id="files"></div>
  </body>
</html>
````

installation
============

With [npm](http://npmjs.org) do:

    npm install fileify

license
=======

MIT/X11
