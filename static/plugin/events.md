# Event

## Event来源
在整理Modal的时候，发现将open等事件的监听绑定在HTMLElement元素上，会存在一些编码上的不方便，代码的抽象层次也会略微低一些。

复制[Backbone.Events](http://backbonejs.org/#Events)模块，作为其他插件类扩展的基类，使插件类具有基本的订阅发布能力，将open等相关事件直接绑定在插件对象上，是插件对象和其所使用的HTMLElement对象隔离。


## Todo
1. - [ ] 将ctx和context参数合并，目前存在的问题是ctx和context相互影响，如下例：
	```javascript
    it('default context is `this`', inject(function(Events) {
        var obj = {counter: 0};
        Object.assign(obj, Events);

        function increment() {
            this.counter += 1;
        }

        obj.on({
            a: increment,
            b: increment,
            c: increment
        });

        obj.trigger('a b c');
        expect(obj.counter).to.equal(3);

        obj.off({
            a: increment,
            c: increment
        }, obj);
        obj.trigger('a b c');
        expect(obj.counter).to.equal(4);
    }));
	```


## API
Backbone.Events

Events is a module that can be mixed in to any object, giving the object the ability to bind and trigger custom named events. Events do not have to be declared before they are bound, and may take passed arguments. For example:

var object = {};

_.extend(object, Backbone.Events);

object.on("alert", function(msg) {
  alert("Triggered " + msg);
});

object.trigger("alert", "an event");
For example, to make a handy event dispatcher that can coordinate events among different areas of your application: var dispatcher = _.clone(Backbone.Events)

onobject.on(event, callback, [context])Alias: bind 
Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a large number of different events on a page, the convention is to use colons to namespace them: "poll:start", or "change:selection". The event string may also be a space-delimited list of several events...

book.on("change:title change:author", ...);
Callbacks bound to the special "all" event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:

proxy.on("all", function(eventName) {
  object.trigger(eventName);
});
All Backbone event methods also support an event map syntax, as an alternative to positional arguments:

book.on({
  "change:author": authorPane.update,
  "change:title change:subtitle": titleView.update,
  "destroy": bookView.remove
});
To supply a context value for this when the callback is invoked, pass the optional last argument: model.on('change', this.render, this) or model.on({change: this.render}, this).

offobject.off([event], [callback], [context])Alias: unbind 
Remove a previously-bound callback function from an object. If no context is specified, all of the versions of the callback with different contexts will be removed. If no callback is specified, all callbacks for the event will be removed. If no event is specified, callbacks for all events will be removed.

// Removes just the `onChange` callback.
object.off("change", onChange);

// Removes all "change" callbacks.
object.off("change");

// Removes the `onChange` callback for all events.
object.off(null, onChange);

// Removes all callbacks for `context` for all events.
object.off(null, null, context);

// Removes all callbacks on `object`.
object.off();
Note that calling model.off(), for example, will indeed remove all events on the model — including events that Backbone uses for internal bookkeeping.

triggerobject.trigger(event, [*args]) 
Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be passed along to the event callbacks.

onceobject.once(event, callback, [context]) 
Just like on, but causes the bound callback to fire only once before being removed. Handy for saying "the next time that X happens, do this". When multiple events are passed in using the space separated syntax, the event will fire once for every event you passed in, not once for a combination of all events

listenToobject.listenTo(other, event, callback) 
Tell an object to listen to a particular event on an other object. The advantage of using this form, instead of other.on(event, callback, object), is that listenTo allows the object to keep track of the events, and they can be removed all at once later on. The callback will always be called with object as context.

view.listenTo(model, 'change', view.render);
stopListeningobject.stopListening([other], [event], [callback]) 
Tell an object to stop listening to events. Either call stopListening with no arguments to have the object remove all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to on a specific object, or a specific event, or just a specific callback.

view.stopListening();

view.stopListening(model);
listenToOnceobject.listenToOnce(other, event, callback) 
Just like listenTo, but causes the bound callback to fire only once before being removed.

