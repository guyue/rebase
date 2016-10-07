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
});
