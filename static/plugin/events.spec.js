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
});
