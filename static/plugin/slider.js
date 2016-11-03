define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Events = require('./events'),
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
        this.transformPrefix = common.browserCapabilities.prefix;
        this.transformProperty = common.browserCapabilities.transform;

        $(element).on('touchstart', this.touchStart.bind(this));
        $(element).on('touchmove', this.touchMove.bind(this));
        $(element).on('touchend', this.touchEnd.bind(this));
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
        },

        setSlideNumber: function setSlideNumber(offset) {
            console.log(this.deltaX);
            var round = offset ? (this.deltaX < 0 ? 'ceil' : 'floor') : 'round';
            this.slideNumber = Math[round](this.getScroll() / (this.scrollableArea / this.slider.children.length));
            this.slideNumber += offset;
            this.slideNumber = Math.min(this.slideNumber, 0);
            this.slideNumber = Math.max(-(this.slider.children.length - 1), this.slideNumber);
        },

        getTouches: function getTouches(e) {
            return e.originalEvent.touches;
        },

        touchStart: function touchStart(e) {
            var touchStartEvent = this.dispatchEvent('touchstart');

            if (touchStartEvent.defaultPrevented) {
                return;
            }

            this.slider = this.getSlider(e.target);
            if (!this.slider) {
                return;
            }

            var firstItem = this.slider.querySelector('.slide');
            this.scrollableArea = firstItem.offsetWidth * this.slider.children.length;
            this.isScrolling = false;
            this.sliderWidth = this.slider.offsetWidth;
            this.resistance = 1;
            this.lastSlide = -(this.slider.children.length - 1);
            this.startTime = Date.now();
            this.pageX = this.getTouches(e)[0].pageX;
            this.pageY = this.getTouches(e)[0].pageY;
            this.deltaX = 0;
            this.deltaY = 0;

            this.setSlideNumber(0);

            this.dispatchEvent('touchstarted');

            console.log(this);
        },

        touchMove: function touchMove(e) {
            var touches = this.getTouches(e);
            if (touches.length > 1 || !this.slider) {
                // Exit if a pinch || no slider
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
            console.log(this.deltaX, this.deltaY);

            if (!this.isScrolling && this.startMoving) {
                this.isScrolling = Math.abs(this.deltaY) > Math.abs(this.deltaX);
            }

            if (this.isScrolling) {
                return;
            }

            e.preventDefault();
            this.offsetX = (this.deltaX / this.resistance) + this.getScroll();

            if (this.slideNumber === 0 && this.deltaX > 0) {
                this.resistance = this.pageX / this.sliderWidth + 1.25;
            } else if (this.slideNumber === this.lastSlide && this.delta < 0) {
                this.resistance = Math.abs(this.pageX) / this.sliderWidth + 1.25;
            } else {
                this.resistance = 1;
            }

            this.slider.style[this.transformProperty] = 'translate3d(' + this.offsetX + 'px, 0, 0)';
            this.startedMoving = true;
        },

        touchEnd: function touchEnd(e) {
            if (!this.slider || this.isScrolling) {
                return;
            }

            this.startedMoving = false;
            var offset = 0;
            if (Date.now() - this.startTime < 1000 && Math.abs(this.deltaX) > 15) {
                if (this.deltaX < 0) {
                    offset = - 1;
                } else {
                    offset = 1;
                }
            }

            this.setSlideNumber(offset);
            this.offsetX = this.slideNumber * this.sliderWidth;
            this.slider.style[this.transformPrefix + 'transition-duration'] = '.2s';
            this.slider.style[this.transformProperty] = 'translate3d(' + this.offsetX + 'px, 0, 0)';

            this.dispatchEvent('slide', {
                detail: {slideNumber: Math.abs(this.slideNumber)},
            });
        }
    };

    module.exports = Slider;
});
