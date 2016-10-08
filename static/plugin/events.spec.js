describe('Event Test Suite', function () {
    'use strict';


    var expect = chai.expect;


    function inject(callback, isAysnc) {
        return function (done) {
            seajs.use(['/plugin/events'], function (Events) {

                if (isAysnc) {
                    callback(Events, done);
                } else {
                    callback(Events);
                    done();
                }

            });
        };
    }


    it('on and trigger', inject(function (Events) {
        var obj = {
            counter: 0
        };
        Object.assign(obj, Events);
        obj.on('event', function() {
            obj.counter += 1;
        });
        obj.trigger('event');
        expect(obj.counter).to.equal(1);
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        expect(obj.counter).to.equal(5);
    }));


    it('binding and triggering multiple events', inject(function (Events) {
        var obj = {
            counter: 0
        };
        Object.assign(obj, Events);
 
        obj.on('a b c', function() {
            obj.counter += 1;
        });
 
        obj.trigger('a');
        expect(obj.counter).to.equal(1);
 
        obj.trigger('a b');
        expect(obj.counter).to.equal(3);
 
        obj.trigger('c');
        expect(obj.counter).to.equal(4);
 
        obj.off('a c');
        obj.trigger('a b c');
        expect(obj.counter).to.equal(5);
    }));


    it('binding and triggering with event maps', inject(function(Events) {
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

        obj.trigger('a');
        expect(obj.counter).to.equal(1);

        obj.trigger('a b');
        expect(obj.counter).to.equal(3);

        obj.trigger('c');
        expect(obj.counter).to.equal(4);

        obj.off({
            a: increment,
            c: increment
        });
        obj.trigger('a b c');
        expect(obj.counter).to.equal(5);
    }));


    it('binding and triggering multiple event names with event maps', inject(function(Events) {
        var obj = {counter: 0};
        Object.assign(obj, Events);

        var increment = function() {
            this.counter += 1;
        };

        obj.on({
            'a b c': increment
        });

        obj.trigger('a');
        expect(obj.counter).to.equal(1);

        obj.trigger('a b');
        expect(obj.counter).to.equal(3);

        obj.trigger('c');
        expect(obj.counter).to.equal(4);

        obj.off({
            'a c': increment
        });
        obj.trigger('a b c');
        expect(obj.counter).to.equal(5);
    }));


    it('binding and trigger with event maps context', inject(function(Events) {
        var obj = {counter: 0};
        var context = {};
        Object.assign(obj, Events);

        obj.on({
            a: function() {
                // 'defaults `context` to `callback` param'
                expect(this).to.equal(context);
            }
        }, context).trigger('a');

        obj.off().on({
            a: function() {
                // 'will not override explicit `context` param'
                expect(this).to.equal(context);
            }
        }, obj, context).trigger('a');
    }));


    it('listenTo and stopListening', inject(function(Events) {
        var a = Object.assign({name: 'a'}, Events);
        var b = Object.assign({name: 'b'}, Events);
        a.listenTo(b, 'all', function(){
            expect(true).to.be.true;
        });
        b.trigger('anything');
        a.listenTo(b, 'all', function(){
            expect(true).to.be.false;
        });
        a.stopListening();
        b.trigger('anything');
    }));


    it('listenTo and stopListening with event maps', inject(function(Events) {
        var a = Object.assign({name: 'a'}, Events);
        var b = Object.assign({name: 'b'}, Events);
        var counter = 0;
        function cb(){
            counter += 1;
        };
        var counter2 = 0;
        function cb2(){
            counter2 += 1;
        };
        a.listenTo(b, {event: cb});
        b.trigger('event');
        expect(counter).to.equal(1);
        a.listenTo(b, {event2: cb2});
        b.on('event2', cb2);
        a.stopListening(b, {event2: cb2});
        b.trigger('event event2');
        expect(counter).to.equal(2);
        expect(counter2).to.equal(1);
        a.stopListening();
        b.trigger('event event2');
        expect(counter).to.equal(2);
        expect(counter2).to.equal(2);
    }));


    it('stopListening with omitted args', inject(function(Events) {
        var a = Object.assign({name: 'a'}, Events);
        var b = Object.assign({name: 'b'}, Events);
        var counter = 0;
        function cb() {
            counter += 1;
        }
        a.listenTo(b, 'event', cb);
        b.on('event', cb);
        a.listenTo(b, 'event2', cb);
        a.stopListening(null, {event: cb});
        b.trigger('event event2');
        expect(counter).to.equal(2);
        b.off();
        a.listenTo(b, 'event event2', cb);
        a.stopListening(null, 'event');
        a.stopListening();
        b.trigger('event2');
        expect(counter).to.equal(2);
    }));


    it('listenToOnce', inject(function(Events) {
        // Same as the previous test, but we use once rather than having to explicitly unbind
        var obj = {counterA: 0, counterB: 0};
        Object.assign(obj, Events);
        var incrA = function(){ obj.counterA += 1; obj.trigger('event'); };
        var incrB = function(){ obj.counterB += 1; };
        obj.listenToOnce(obj, 'event', incrA);
        obj.listenToOnce(obj, 'event', incrB);
        obj.trigger('event');
        expect(obj.counterA).to.equal(1);
        expect(obj.counterB).to.equal(1);
    }));


    it('listenToOnce and stopListening', inject(function(Events) {
        var a = Object.assign({}, Events);
        var b = Object.assign({}, Events);
        var counter = 0;
        a.listenToOnce(b, 'all', function() { counter += 1; });
        b.trigger('anything');
        b.trigger('anything');
        expect(1).to.equal(counter);
        a.listenToOnce(b, 'all', function() { counter += 1; });
        a.stopListening();
        b.trigger('anything');
        expect(1).to.equal(counter);
    }));


    it('listenTo, listenToOnce and stopListening', inject(function(Events) {
        var a = Object.assign({}, Events);
        var b = Object.assign({}, Events);
        var counter = 0;
        a.listenToOnce(b, 'all', function() { counter += 1; });
        b.trigger('anything');
        b.trigger('anything');
        expect(1).to.equal(counter);
        a.listenTo(b, 'all', function() { counter += 1; });
        a.stopListening();
        b.trigger('anything');
        expect(1).to.equal(counter);
    }));


    it('listenTo and stopListening with event maps', inject(function(Events) {
        var a = Object.assign({}, Events);
        var b = Object.assign({}, Events);
        var counter = 0;
        a.listenTo(b, {change: function(){ counter += 1; }});
        b.trigger('change');
        expect(counter).to.equal(1);
        a.listenTo(b, {change: function(){ counter += 1; }});
        a.stopListening();
        b.trigger('change');
        expect(counter).to.equal(1);
    }));


    it('listenTo yourself', inject(function(Events) {
        var e = Object.assign({}, Events);
        var counter = 0;
        e.listenTo(e, 'foo', function(){ counter += 1; });
        e.trigger('foo');
        expect(counter).to.equal(1);
    }));

    it('listenTo yourself cleans yourself up with stopListening', inject(function(Events) {
        var e = Object.assign({}, Events);
        var counter = 0;
        e.listenTo(e, 'foo', function(){ counter += 1; });
        e.trigger('foo');
        expect(counter).to.equal(1);
        e.stopListening();
        e.trigger('foo');
        expect(counter).to.equal(1);
    }));


    it('listenToOnce with event maps binds the correct `this`', inject(function(Events) {
        var a = Object.assign({}, Events);
        var b = Object.assign({}, Events);
        a.listenToOnce(b, {
            one: function() {
                expect(this).to.equal(a);
            },
            two: function() { }
        });
        b.trigger('one');
    }));


    it("listenTo with empty callback doesn't throw an error", inject(function(Events) {
        var e = Object.assign({}, Events);
        e.listenTo(e, 'foo', null);
        e.trigger('foo');
        expect(true).to.be.true;
    }));


    it('trigger all for each event', inject(function(Events) {
        var a, b, obj = {counter: 0};
        Object.assign(obj, Events);
        obj.on('all', function(event) {
            obj.counter++;
            if (event === 'a') a = true;
            if (event === 'b') b = true;
        }).trigger('a b');
        expect(a).to.be.true;
        expect(b).to.be.true;
        expect(obj.counter).to.equal(2);
    }));


    it('on, then unbind all functions', inject(function(Events) {
        var obj = {counter: 0};
        Object.assign(obj, Events);
        var callback = function() { obj.counter += 1; };
        obj.on('event', callback);
        obj.trigger('event');
        obj.off('event');
        obj.trigger('event');
        expect(obj.counter).to.equal(1);
    }));


    it('bind two callbacks, unbind only one', inject(function(Events) {
        var obj = {counterA: 0, counterB: 0};
        Object.assign(obj, Events);
        var callback = function() { obj.counterA += 1; };
        obj.on('event', callback);
        obj.on('event', function() { obj.counterB += 1; });
        obj.trigger('event');
        obj.off('event', callback);
        obj.trigger('event');
        expect(obj.counterA).to.equal(1);
        expect(obj.counterB).to.equal(2);
    }));


    it('unbind a callback in the midst of it firing', inject(function(Events) {
        var obj = {counter: 0};
        Object.assign(obj, Events);
        var callback = function() {
            obj.counter += 1;
            obj.off('event', callback);
        };
        obj.on('event', callback);
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        expect(obj.counter).to.equal(1);
    }));


    it('two binds that unbind themeselves', inject(function(Events) {
        var obj = {counterA: 0, counterB: 0};
        Object.assign(obj, Events);
        var incrA = function(){ obj.counterA += 1; obj.off('event', incrA); };
        var incrB = function(){ obj.counterB += 1; obj.off('event', incrB); };
        obj.on('event', incrA);
        obj.on('event', incrB);
        obj.trigger('event');
        obj.trigger('event');
        obj.trigger('event');
        expect(obj.counterA).to.equal(1);
        expect(obj.counterB).to.equal(1);
    }));


    it('bind a callback with a default context when none supplied', inject(function(Events) {
        var obj = Object.assign({
            assertTrue: function() {
                expect(this).to.equal(obj);
            }
        }, Events);

        obj.once('event', obj.assertTrue);
        obj.trigger('event');
    }));


    it('bind a callback with a supplied context', inject(function(Events) {
        var TestClass = function() {
            return this;
        };
        TestClass.prototype.assertTrue = function() {
            expect(this).to.be.an.instanceof(TestClass);
        };

        var obj = Object.assign({}, Events);
        obj.on('event', function() { this.assertTrue(); }, new TestClass);
        obj.trigger('event');
    }));


    it('nested trigger with unbind', inject(function(Events) {
        var obj = {counter: 0};
        Object.assign(obj, Events);
        var incr1 = function(){ obj.counter += 1; obj.off('event', incr1); obj.trigger('event'); };
        var incr2 = function(){ obj.counter += 1; };
        obj.on('event', incr1);
        obj.on('event', incr2);
        obj.trigger('event');
        expect(obj.counter).to.equal(3);
    }));


    it('callback list is not altered during trigger', inject(function(Events) {
        var counter = 0, obj = Object.assign({}, Events);
        var incr = function(){ counter++; };
        var incrOn = function(){ obj.on('event all', incr); };
        var incrOff = function(){ obj.off('event all', incr); };

        obj.on('event all', incrOn).trigger('event');
        expect(counter).to.equal(0);

        obj.off().on('event', incrOff).on('event all', incr).trigger('event');
        expect(counter).to.equal(2);
    }));


    describe('Cleans up references', function () {
        function size(obj) {
            if (!obj) {
                return 0;
            }

            return Object.keys(obj).length;
        }


        it('stopListening cleans up references', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            var fn = function() {};
            b.on('event', fn);
            a.listenTo(b, 'event', fn).stopListening();
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn).stopListening(b);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn).stopListening(b, 'event');
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn).stopListening(b, 'event', fn);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
        }));


        it('stopListening cleans up references from listenToOnce', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            var fn = function() {};
            b.on('event', fn);
            a.listenToOnce(b, 'event', fn).stopListening();
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenToOnce(b, 'event', fn).stopListening(b);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenToOnce(b, 'event', fn).stopListening(b, 'event');
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
            a.listenToOnce(b, 'event', fn).stopListening(b, 'event', fn);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._events.event)).to.equal(1);
            expect(size(b._listeners)).to.equal(0);
        }));


        it('listenTo and off cleaning up references', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            var fn = function() {};
            a.listenTo(b, 'event', fn);
            b.off();
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn);
            b.off('event');
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn);
            b.off(null, fn);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._listeners)).to.equal(0);
            a.listenTo(b, 'event', fn);
            b.off(null, null, a);
            expect(size(a._listeningTo)).to.equal(0);
            expect(size(b._listeners)).to.equal(0);
        }));


        it('listenTo and stopListening cleaning up references', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            var fn = function() {};
            a.listenTo(b, 'all', fn);
            b.trigger('anything');
            a.listenTo(b, 'other', fn);
            a.stopListening(b, 'other');
            a.stopListening(b, 'all');
            expect(size(a._listeningTo)).to.equal(0);
        }));


        it('listenToOnce without context cleans up references after the event has fired', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            a.listenToOnce(b, 'all', function(){ });
            b.trigger('anything');
            expect(size(a._listeningTo)).to.equal(0);
        }));


        it('listenToOnce with event maps cleans up references', inject(function(Events) {
            var a = Object.assign({}, Events);
            var b = Object.assign({}, Events);
            a.listenToOnce(b, {
                one: function() { },
                two: function() { }
            });
            b.trigger('one');
            expect(size(a._listeningTo)).to.equal(1);
        }));
    });
});
