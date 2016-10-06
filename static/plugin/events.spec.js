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


});
