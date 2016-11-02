describe('Slider Test Suite', function () {
    'use strict';


    var expect = chai.expect;


    function inject(callback, isAysnc) {
        return function (done) {
            seajs.use(['/plugin/slider'], function (Slider) {

                if (isAysnc) {
                    callback(Slider, done);
                } else {
                    callback(Slider);
                    done();
                }

            });
        };
    }


});
