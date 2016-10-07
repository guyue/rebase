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


});
