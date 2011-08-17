var assert = require('assert');
var browserify = require('browserify');
var fileify = require('../');
var vm = require('vm');

exports.twice = function () {
    var src = browserify()
        .use(fileify('one', __dirname + '/static'))
        .use(fileify('two', __dirname + '/two'))
        .bundle()
    ;
    
    var c = {};
    vm.runInNewContext(src, c);
    assert.deepEqual(c.require('one'), {
        'bar.sh' : '#!/bin/bash\necho bar!\n',
        'foo.txt' : 'This is the foo file!\n',
        'baz/quux.js' : 'console.log(\'quux!\')\n',
    });
    assert.deepEqual(c.require('two'), {
        'a.txt' : 'Aa97\n',
    });
};
