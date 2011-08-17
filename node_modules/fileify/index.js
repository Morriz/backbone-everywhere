var fs = require('fs');
var path = require('path');
var findit = require('findit');
var Seq = require('seq');

module.exports = {
    files: {}
};

module.exports.register = function(target, dir, optsOrEx) {
    if (!target) 
        throw new Error('Target name required');
    if (!dir) 
        throw new Error('Directory or files required');
    
    var opts = typeof optsOrEx === 'object' && !Array.isArray(optsOrEx) ? optsOrEx : {
        extension: optsOrEx
    };
    
    var filter = function(file) {
        var ext = path.extname(file);
        if (!opts.extension) {
            return true;
        }
        else if (typeof opts.extension === 'function') {
            return opts.extension(file);
        }
        else if (typeof opts.extension === 'string') {
            return opts.extension === ext;
        }
        else if (Array.isArray(opts.extension)) {
            return opts.extension.some(function(e) {
                return e === ext
            });
        }
        else {
            return true;
        }
    };
    
    var watches = {};
    var files = [];
    
    function finder(file, stat) {
        if (stat.isDirectory()) {
            if (opts.watch) {
                watches[file] = true;
                fs.watchFile(file, function(curr, prev) {
                    if (curr.nlink === 0) {
                        // deleted
                    }
                    else {
                        // modified
                        fs.readdir(file, function(err, xs) {
                            var rescan = false;
                            xs.forEach(function(x) {
                                var f = path.resolve(dir, x);
                                if (files.indexOf(f) < 0) {
                                    files.push(f);
                                    updateBundle();
                                }
                            });
                        });
                    }
                });
            }
        }
        else if (filter(file)) {
            var i = files.length;
            files.push(file);
            
            if (opts.watch) {
                watches[file] = true;
                fs.watchFile(file, function(curr, prev) {
                    if (curr.nlink === 0) {
                        // deleted
                        var i = files.indexOf(file);
                        if (i >= 0) 
                            files.splice(i, 1);
                        updateBundle();
                    }
                    else {
                        updateBundle();
                    }
                });
            }
        }
    }
    
    finder(dir, {
        isDirectory: function() {
            return true
        }
    });
    findit.sync(dir, finder);
    
    var bodies;
    var getBodies = function() {
        bodies = files.reduce(function(acc, file) {
            var rel = file.slice(dir.length + 1);
            opts.removeExtension && (rel = rel.substr(0, rel.length - opts.extension.length));
            acc[rel] = fs.readFileSync(file, 'utf8');
            module.exports.files[rel] = acc[rel];
            return acc;
        }, {});
    }
    // populate exports.files first
    getBodies();
    
    var _bundle;
    var _dst;
    var updateBundle = function(dst) {

        getBodies();
        
        var file = __dirname + '/browser/files.js';
        var body = fs.readFileSync(file, 'utf8').replace(/\$bodies/, function() {
            return JSON.stringify(bodies);
        });
        
        _bundle.include(null, _dst, body);
    };

    var self = function(bundle) {
        
        // register the bundle, which is usually one and the same (actually depending on it here!!)
        _bundle = bundle;
        _dst = path.normalize('/node_modules/' + target);
        
        Object.keys(bundle.files).forEach(function(key) {
            if (bundle.files[key].target === _dst) {
                delete bundle.files[key];
            }
        });
        updateBundle();
        
    };
    
    self.end = function() {
        Object.keys(watches).forEach(function(file) {
            fs.unwatchFile(file);
        });
    };
    
    return self;
};
