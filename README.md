# Songlist, based upon the Todo app by Jeremy Ashkenase.


## Technologies

+ Node
+ Express
+ Browserify
+ Fileify
+ Backbone
+ Socket.io
+ Redis
+ HTML5's pushState

## Browser compatibility

I have tested this app to work with Firefox 5.0.1, Safari 5.1, Chrome 13, Mobile Safari for iOS 4.3 and IE9 standards mode (no pushState to).

## Why this app?

I have created this app as a demo to show that Backbone can be used in full effect on the server, together with jquery, socket.io and redis, to render stateful server side views that continue to live in the browser.
The same MVC stack is packed using browserify to let the client take over and let javascript handle it from there. No full page rendering is necessary afterwards.
Href clicks are hijacked and mapped onto the instantiated Backbone routers, using pushState to reflect the app state in the url.
The client has access to all scripts by means of 'require', including templates, which where packaged with browserify, and optionally minified/uglified with fileify. 
If no javascript is available, the html output from the server will still reflect the user session's state.

To test all of the backbone-redis functionality I have adapted the Todo app by Jeremy Ashkenase to a Songlist app, which has 2 views: Songlist (which uses a SongCollection, doh!) and Song (which uses a SongModel, and shows the song details).
The Backbone.Model.subscribe() and Backbone.Collection.subscribe() methods provide by backbone-redis make it possible to have models and collections subscribe to changes from the server.

If you run the app in two browser sessions and make changes to the models by manipulating the view inputs, you will see the changes propagate to the other connected client(s).
This is of course entirely up to the developer.

I have put the model.subscribe() statements in the router's handler logic (which used to be called 'controller', which I prefer, since that is what it is), because this subscription will affect that model in the entire application, not just one view where that model is used. Therefore I don't think it should go anywhere in any View code.

## Issues with this setup

###Server availability

I have understood that Node.js is a non blocking server needing to serve it's payload asap. But to build a full html page and get async data from redis I simply have to wait for all to be ready before serving up the initial page. This might be costly in an environment with high concurrency.
Maybe this doesn't have the impact I worry about.
No benchmarks were run.

###Hacky ways of piping functionality.

Since this is a demo, and even tho I think I did quite a clean job, there are many rooms for improvement. But it shows that it's possible to have a high code reusage when it comes to asynchronous web programming ;)

## Modifications needed on required modules.

I had to do some modifications to make some required modules work as expected in a CommonJS environment. On some occasions I simply had to fix a bug.
Please look into the node_modules folder for the adapted/fixed modules.

The most important (from the top of my head) are:

- backbone: added a "require('jquery')" to set $ when in CommonJS mode because of browserify.
- fileify: modified to expose an extra method that gives back the compiled file registry when registering a folder with files ('templates' in my case).
- jquery: fixed the header part around jquery to not delete webkits own XMLHttpRequest (which breaks the app in webkit browsers)
- backbone-redis: built by Beau Sorenson, but adapted by me to fix a lot of issues which could not be tested with the regular Todo app originally shipped with backbone.

All of my changes are already submitted to the original authors, and I hope these will be included in some form in their modules.

Hopefully this setup can be used as an example to create a web application that complies with the "write once, run anywhere" paradigm. 