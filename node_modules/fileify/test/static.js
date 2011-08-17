var assert = require('assert');
var browserify = require('browserify');
var fileify = require('../');
var vm = require('vm');

exports.static = function () {
    var src = browserify()
        .use(fileify('files', __dirname + '/static'))
        .bundle()
    ;
    
    var c = {};
    vm.runInNewContext(src, c);
    assert.deepEqual(c.require('files', '/'), {
        'bar.sh' : '#!/bin/bash\necho bar!\n',
        'foo.txt' : 'This is the foo file!\n',
        'baz/quux.js' : 'console.log(\'quux!\')\n',
    });
};
