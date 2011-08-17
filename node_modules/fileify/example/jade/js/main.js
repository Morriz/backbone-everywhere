var render = require('./render');
var deck = require('deck');
var $ = require('jquery');

$(window).ready(function () {
    setInterval(function () {
        var titles = [ 'foo', 'bar', 'baz' ];
        var bodies = [ 'what', 'lul', 'oh hello' ];
        
        var msg = render('msg.jade', {
            title : deck.pick(titles),
            body : deck.pick(bodies) 
        }).appendTo($('#messages'));
        
        setTimeout(function () {
            msg.animate({
                opacity : 'toggle',
                height : 'toggle'
            }, 1000)
        }, 6000);
    }, 2000);
});
