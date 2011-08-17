var assert = require('assert');
var browserify = require('browserify');
var fileify = require('../');
var vm = require('vm');
var fs = require('fs');

function write (file, x, cb) {
    fs.writeFile(__dirname + '/watch/' + file, x.toString(), function (err) {
        if (err) assert.fail(err)
        else setTimeout(cb, 300)
    });
}

exports.watch = function () {
    try { fs.mkdir(__dirname + '/watch', '0777') } catch (e) {}
    try { fs.unlinkSync(__dirname + '/watch/x.txt') } catch (e) {}
    try { fs.unlinkSync(__dirname + '/watch/y.txt') } catch (e) {}
    try { fs.mkdir(__dirname + '/watch/subdir', '0777') } catch (e) {}
    try { fs.unlinkSync(__dirname + '/watch/subdir/z.txt') } catch (e) {}
    
    var x0 = Math.random();
    write('x.txt', x0, function () {
        var fn = fileify('files', __dirname + '/watch', { watch : true });
        var b = browserify().use(fn);
        
        var c0 = {};
        vm.runInNewContext(b.bundle(), c0);
        assert.deepEqual(c0.require('files', '/'), { 'x.txt' : x0 });
        
        var x1 = Math.random();
        write('x.txt', x1, function () {
            var c1 = {};
            vm.runInNewContext(b.bundle(), c1);
            assert.deepEqual(c1.require('files', '/'), { 'x.txt' : x1 });
            
            var y0 = Math.random();
            write('y.txt', y0, function () {
                var c2 = {};
                vm.runInNewContext(b.bundle(), c2);
                assert.deepEqual(c2.require('files', '/'), {
                    'x.txt' : x1,
                    'y.txt' : y0,
                });
                var z0 = Math.random();
                write('subdir/z.txt', z0, function () {
                    var c3 = {};
                    vm.runInNewContext(b.bundle(), c3);
                    assert.deepEqual(c3.require('files', '/'), {
                        'x.txt' : x1,
                        'y.txt' : y0,
                        'subdir/z.txt' : z0,
                    });
                    fn.end();
                });
            });
        });
    });
};
