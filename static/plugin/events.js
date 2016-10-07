define(function (require, exports, module) {
    'use strict';


    var Events = {};
    var eventSplitter = /\s+/;
    var uniqueId = (function () {
        var idCounter = 0;

        return function (prefix) {
            idCounter += 1;
            var id = '' + idCounter;
            return prefix ? prefix + id : id;
        };
    }());


    function eventsApi(iteratee, events, name, callback, options) {
        if (name && typeof name === 'object') {
            if (callback !== undefined &&
                    options.hasOwnProperty('context') &&
                    options.context === undefined) {
                options.context = callback;
            }

            Object.keys(name).forEach(function (n) {
                events = eventsApi(iteratee, events, n, name[n], options);
            });
        } else if (name && eventSplitter.test(name)) {
            name.split(eventSplitter).forEach(function (n) {
                events = iteratee(events, n, callback, options);
            });
        } else {
            events = iteratee(events, name, callback, options);
        }

        return events;
    }


    function onApi(events, name, callback, options) {
        if (callback) {
            var handlers = events[name] || (events[name] = []);
            var context = options.context,
                ctx = options.ctx,
                listening = options.listening;

            if (listening) {
                listening.count += 1;
            }

            handlers.push({
                callback: callback,
                context: context,
                ctx: context || ctx,
                listening: listening
            });
        }

        return events;
    }


    function internalOn(obj, name, callback, context, listening) {
        obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
            context: context,
            ctx: obj,
            listening: listening
        });

        if (listening) {
            var listeners = obj._listeners || (obj._listeners = {});
            if (!listeners[listening.id]) {
                listeners[listening.id] = listening;
            }
        }

        return obj;
    }


    Events.on = function (name, callback, context) {
        return internalOn(this, name, callback, context);
    };


    Events.listenTo = function (obj, name, callback) {
        if (!obj) {
            return;
        }

        var id = obj._listenId || (obj._listenId = uniqueId('l'));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = listeningTo[id];

        if (!listening) {
            var thisId = this._listenId || (this._listenId = uniqueId('l'));
            listening = listeningTo[id] = {
                obj: obj,
                objId: id,
                id: thisId,
                listeningTo: listeningTo,
                count: 0
            };
        }

        internalOn(obj, name, callback, this, listening);
        return this;
    };


    function offApi(events, name, callback, options) {
        if (!events) {
            return;
        }

        var context = options.context,
            listeners = options.listeners;

        if (!name && !callback && !context) {
            var ids = Object.keys(listeners || {});

            for (var i = 0, len = ids.length; i < len; i += 1) {
                var listening = listeners[ids[i]];
                delete listeners[listening.id];
                delete listeners.listeningTo[listening.objId];
            }

            // 下面这句return隐藏了一个操作
            // 返回undefined值在eventsApi作为返回值，覆盖宿主对象的_events属性
            // 达到删除_events对象的效果
            return;
        }

        var names = name ? [name] : Object.keys(events);

        for (var i = 0, len = names.length; i < len; i += 1) {
            name = names[i];
            var handlers = events[name];
            if (!handlers) {
                break;
            }
            var remaining = [];
            for (var j = 0; j < handlers.length; j += 1) {
                var handler = handlers[j];
                if (callback && callback !== handler.callback &&
                        callback !== handler.callback._callback ||
                        context && context !== handler.context) {
                    remaining.push(handler);
                } else {
                    var listening = handler.listening;
                    if (listening && --listening.count === 0) {
                        delete listeners[listening.id];
                        delete listening.listeningTo[listening.objId];
                    }
                }
            }

            if (remaining.length) {
                events[name] = remaining;
            } else {
                delete events[name];
            }
        }

        return events;
    }


    Events.off = function (name, callback, context) {
        if (!this._events) {
            return;
        }

        this._events = eventsApi(offApi, this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });

        return this;
    };


    Events.stopListening = function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) {
            return;
        }

        var ids = obj ? [obj._listenId] : Object.keys(listeningTo);

        for (var i = 0; i < ids.length; i += 1) {
            var listening = listeningTo[ids[i]];

            if (!listening) {
                break;
            }

            listening.obj.off(name, callback, this);
        }

        return this;
    };


    function onceMap(map, name, callback, offer) {
        if (callback) {
            var once = map[name] = function () {
                offer(name, callback);
                // 作用域已经在triggerEvents中修正为this
                callback.apply(this, arguments);
            };
            once._callback = callback;
        }

        return map;
    }


    Events.once = function (name, callback, context) {
        var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
        if (typeof name === 'string' && !!context) {
            callback = undefined;
        }

        return this.on(events, callback, context);
    };


    Events.listenToOnce = function (obj, name, callback) {
        var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
        return this.listenTo(obj, events);
    };


    function triggerEvents(events, args) {
        var a1 = args[0],
            a2 = args[1],
            a3 = args[2];

        switch(args.length) {
            case 0:
                events.forEach(function (ev) {
                    ev.callback.call(ev.ctx);
                });
                return;
            case 1:
                events.forEach(function (ev) {
                    ev.callback.call(ev.ctx, a1);
                });
                return;
            case 2:
                events.forEach(function (ev) {
                    ev.callback.call(ev.ctx, a1, a2);
                });
                return;
            case 3:
                events.forEach(function (ev) {
                    ev.callback.call(ev.ctx, a1, a2, a3);
                });
                return;
            default:
                events.forEach(function (ev) {
                    ev.callback.apply(ev.ctx, args);
                });
                return;
        }
    }


    // callback参数只是使用eventsApi方法的占位而已
    function triggerApi(objEvents, name, callback, args) {
        if (objEvents) {
            var events = objEvents[name];
            var allEvents = objEvents.all;

            // 做一个新的allEvents副本的用意是什么呢？
            if (events && allEvents) {
                allEvents = allEvents.slice();
            }

            if (events) {
                triggerEvents(events, args);
            }

            if (allEvents) {
                triggerEvents(allEvents, [name].concat(args));
            }
        }

        return objEvents;
    }


    Events.trigger = function (name) {
        if (!this._events) {
            return;
        }

        var args = [].slice.call(arguments, 1);
        eventsApi(triggerApi, this._events, name, undefined, args);

        return this;
    };


    module.exports = Events;
});
