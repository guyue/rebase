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

        it('使用new或函数的调用方式，都会返回Modal实例对象', inject(function (Modal) {
            var element = document.createElement('div');
            expect(new Modal(element)).to.be.an.instanceOf(Modal);
            expect(Modal(element)).to.be.an.instanceOf(Modal);
        }));

        it('当传入的element参数无效时，将抛出错误', inject(function (Modal) {

            expect(function () {
                new Modal();
            }).to.throw(TypeError);

            expect(function () {
                new Modal('.modal');
            }).to.throw(TypeError);

            expect(function () {
                new Modal(document.querySelectorAll('.modal'));
            }).to.throw(TypeError);

        }));

    });

});
