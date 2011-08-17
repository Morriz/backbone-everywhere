var views = require('views');
var jade = require('jade');
var $ = require('jquery');

module.exports = function (file, vars, opts) {
    if (!opts) opts = {};
    opts.locals = vars;
    return $(jade.render(views[file], opts));
};
