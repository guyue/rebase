define(function (require, exports, module) {
    'use strict';

    var Events = require('./events'),
        common = require('./common');

    function Slider(element, options) {
        if (!(this instanceof Slider)) {
            return new Slider(element, options);
        }

        if (!(element instanceof HTMLElement)) {
            throw new TypeError('element参数应该是HTMLElement元素');
        }

        Object.assign(this, Events);

        this.element = element;
        this.slider = element.querySelector('.slide-group');
        this.transformProperty = common.browserCapabilities.transform;
    }

    Slider.prototype = {
        constructor: Slider,

        getSlider: function getSlider(target) {

            for (; target && target !== document.body && target !== document;
                    target = target.parentElement || target.parentNode) {

                if (target.classList && target.classList.contains('slide-group')) {
                    return target;
                }

            }

            return null;
        },

        getScroll: function getScroll() {
            var translate3d = this.slider.style[this.transformProperty].match(/translate3d\(([^,]*)/);

            if (translate3d) {
                return parseInt(translate3d[1], 10);
            }

            return 0;
        }
    };

    module.exports = Slider;
});
