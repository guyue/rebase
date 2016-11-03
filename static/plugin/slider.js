define(function (require, exports, module) {
    'use strict';

    var Events = require('./events'),
        common = require('./common'),
        CustomEvent = common.CustomEvent;

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
        if (!this.slider) {
            throw new TypeError('element应该包含.slide-group元素');
        }
        var firstItem = this.slider.querySelector('.slide');
        if (!firstItem) {
            throw new TypeError('element应该包含.slide元素');
        }
        this.slideWidth = firstItem.offsetWidth;
        this.lastSlide = -(this.slider.children.length - 1);

        this.browserPrefix = common.browserCapabilities.prefix;
        this.offsetX = this.getTranslate();

        element.addEventListener('touchstart', this.touchStart.bind(this), false);
        element.addEventListener('touchmove', this.touchMove.bind(this), false);
        element.addEventListener('touchend', this.touchEnd.bind(this), false);
    }

    Slider.prototype = {
        constructor: Slider,

        dispatchEvent: function dispatchEvent(type, options) {
            options = Object.assign({
                canBubble: true,
                cancelable: true
            }, options);
            var event = new CustomEvent(type, options);
            this.trigger(event.type, event);
            return event;
        },

        setTranslate: function setTranslate(offsetX, duration) {
            duration = duration || 0;
            this.slider.style[this.browserPrefix + 'transition-duration'] = String(duration) + 's';
            this.slider.style[this.browserPrefix + 'transform'] = 'translate3d(' + offsetX + 'px, 0, 0)';
        },

        getTranslate: function getTranslate() {
            var translate3d = this.slider.style[this.browserPrefix + 'transform'].match(/translate3d\(([^,]*)/);

            if (translate3d) {
                return parseInt(translate3d[1], 10);
            }

            return 0;
        },

        setSlideNumber: function setSlideNumber(offset) {
            // 自右向左滑动时，deltaX小于0，向上取整，向左滚动；
            // 自左向右滑动时，deltaX大于0，向下取整，向右滚动；
            var round = offset ? (this.deltaX < 0 ? 'ceil' : 'floor') : 'round';
            this.slideNumber = Math[round](this.offsetX / this.slideWidth);
            this.slideNumber += offset;
            this.slideNumber = Math.min(this.slideNumber, 0);
            this.slideNumber = Math.max(-(this.slider.children.length - 1), this.slideNumber);
        },

        updateResistance: function updateResistance() {
            // 自右向左滑动时，deltaX小于0，向左滚动；
            // 自左向右滑动时，deltaX大于0，向右滚动；
            if (this.slideNumber === 0 && this.deltaX > 0) {
                this.resistance = this.deltaX / this.slideWidth + 1.25;
            } else if (this.slideNumber === this.lastSlide && this.delta < 0) {
                this.resistance = Math.abs(this.deltaX) / this.slideWidth + 1.25;
            } else {
                this.resistance = 1;
            }
        },

        touchStart: function touchStart(e) {
            var slideStartEvent = this.dispatchEvent('slidestart');

            if (slideStartEvent.defaultPrevented) {
                return;
            }

            this.isScrolling = false;
            this.resistance = 1;
            this.startTime = Date.now();
            this.pageX = e.touches[0].pageX;
            this.pageY = e.touches[0].pageY;
            this.deltaX = 0;
            this.deltaY = 0;

            this.setSlideNumber(0);

            this.dispatchEvent('slidestarted');
        },

        touchMove: function touchMove(e) {
            var touches = e.touches;

            if (touches.length > 1) {
                // Exit if a pinch
                return;
            }

            if (!this.startedMoving) {
                // adjust the starting position if we just started to avoid jumpage
                this.pageX = touches[0].pageX - 1;
            }

            this.deltaX = touches[0].pageX - this.pageX;
            this.deltaY = touches[0].pageY - this.pageY;
            this.pageX = touches[0].pageX;
            this.pageY = touches[0].pageY;

            if (!this.isScrolling && this.startedMoving) {
                this.isScrolling = Math.abs(this.deltaY) > Math.abs(this.deltaX);
            }

            if (this.isScrolling) {
                return;
            }

            e.preventDefault();
            this.updateResistance();
            this.offsetX += this.deltaX / this.resistance;
            this.setTranslate(this.offsetX);
            this.startedMoving = true;
            this.dispatchEvent('slidemoved');
        },

        touchEnd: function touchEnd(e) {
            if (this.isScrolling) {
                return;
            }

            this.startedMoving = false;
            var offset = 0;
            if (Date.now() - this.startTime < 1000 && Math.abs(this.deltaX) > 15) {
                // 自右向左滑动时，deltaX小于0，向后快速滚动1屏；
                // 自左向右滑动时，deltaX大于0，向前快速滚动1屏；
                if (this.deltaX < 0) {
                    offset = - 1;
                } else {
                    offset = 1;
                }
            }

            this.setSlideNumber(offset);
            this.offsetX = this.slideNumber * this.slideWidth;
            this.setTranslate(this.offsetX, '.2');

            this.dispatchEvent('slideended', {
                detail: {slideNumber: Math.abs(this.slideNumber)},
            });
        }
    };

    module.exports = Slider;
});
