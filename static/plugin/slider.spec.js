describe('Slider Test Suite', function () {
    'use strict';


    var expect = chai.expect;


    function inject(callback, isAysnc) {
        return function (done) {
            seajs.use(['/plugin/slider', '/sass/ratchet.css'], function (Slider) {

                if (isAysnc) {
                    callback(Slider, done);
                } else {
                    callback(Slider);
                    done();
                }

            });
        };
    }

    after(function () {
        var ratchet = document.querySelector('link[href$="/sass/ratchet.css"]');
        if (ratchet && ratchet.parentNode) {
            ratchet.parentNode.removeChild(ratchet);
        }
    });

    var sliderElement;

    beforeEach(function () {
        var div = document.createElement('div');
        div.innerHTML = '<div class="slider" id="slider-example">' +
                '<div class="slide-group">' +
                    '<div class="slide"><img src="/image/slide-1.jpg" /></div>' +
                    '<div class="slide"><img src="/image/slide-2.jpg" /></div>' +
                    '<div class="slide"><img src="/image/slide-3.jpg" /></div>' +
                '</div>' +
            '</div>';
        sliderElement = div.firstElementChild;
    });

    afterEach(function () {
        if (sliderElement.parentNode) {
            sliderElement.parentNode.removeChild(sliderElement);
        }
        sliderElement = null;
    });

    describe('Constructor', function () {

        it('使用new或函数的调用方式，element参数应该是HTMLElement元素，都会返回Slider实例对象', inject(function (Slider) {
            var element = document.createElement('div');
            expect(new Slider(element)).to.be.an.instanceOf(Slider);
            expect(Slider(element)).to.be.an.instanceOf(Slider);
        }));

        it('当传入的element参数无效时，将抛出错误', inject(function (Slider) {

            expect(function () {
                new Slider();
            }).to.throw(TypeError);

            expect(function () {
                new Slider('.slider');
            }).to.throw(TypeError);

            expect(function () {
                new Slider(document.querySelectorAll('.slider'));
            }).to.throw(TypeError);

        }));

    });

    describe('Slider.prototype', function () {
        describe('getSlider', function () {
            it('should get the parent element', inject(function (Slider) {
                var slide = sliderElement.querySelector('.slide');
                expect(Slider.prototype.getSlider(slide)).to.equal(sliderElement.firstElementChild);
            }));
        });

        describe('getScroll', function () {
            it('should get the scroll x', inject(function (Slider) {
                var sliderGroup = sliderElement.querySelector('.slide-group');
                ['MozTransform', 'MsTransform', 'WebkitTransform', 'transform'].forEach(function (transform) {
                    sliderGroup.style[transform] = 'translate3d(20px, 0, 0)';
                });
                expect(new Slider(sliderElement).getScroll()).to.equal(20);
            }));
        });
    });

});