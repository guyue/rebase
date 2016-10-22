define(function (require, exports, module) {
    'use strict';

    function Slider(element, options) {
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
            var translate3d = this.slider.style[transformProperty].match(/translate3d\(/);
        }
    };

    module.exports = Slider;
});
