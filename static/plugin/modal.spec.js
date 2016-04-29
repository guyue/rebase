describe('Modal Test Suite', function () {
    'use strict';

    var expect = chai.expect;

    function inject(callback) {
        return function (done) {
            seajs.use(['/plugin/modal'], function (Modal) {
                callback(Modal);

                done();
            });
        };
    }

    describe('Constructor', function () {

        it('当传入的form参数无效时，将抛出错误', inject(function (Modal) {

            var foo = '1234';
            expect(foo).to.be.a('string');

        }));

    });

});
