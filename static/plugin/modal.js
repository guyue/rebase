define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        common = require('./common'),
        Events = require('./events'),
        CustomEvent = common.CustomEvent;

    function Modal(element, options) {
        if (!(this instanceof Modal)) {
            return new Modal(element, options);
        }

        if (!(element instanceof HTMLElement)) {
            throw new TypeError('element参数应该是HTMLElement元素');
        }

        Object.assign(this, Events);

        this.element = element;
        $(this.getClose()).on('click.modal', this.close.bind(this));

        document.body.appendChild(element);
    }

    Modal.prototype = {
        constructor: Modal,

        getClose: function () {
            return common.query('[data-toggle=modal-close]', this.element);
        },

        dispatchEvent: function dispatchEvent(type) {
            var event = new CustomEvent(type, {
                canBubble: true,
                cancelable: true
            });
            this.trigger(event.type, event);
            return event;
        },

        open: function open() {
            if (!this.element || this.element.classList.contains('active')) {
                return;
            }

            var openEvent = this.dispatchEvent('open');

            if (openEvent.defaultPrevented) {
                return;
            }

            this.element.classList.add('active');

            this.dispatchEvent('opened');
        },

        close: function close(e) {
            if (!this.element) {
                return;
            }

            if (e) {
                e.preventDefault();
            }

            var closeEvent = this.dispatchEvent('close');

            if (closeEvent.defaultPrevented) {
                return;
            }

            this.element.classList.remove('active');

            this.dispatchEvent('closed');
        },

        destroy: function destroy() {
            $(this.getClose()).off('click.modal');
            this.off();
            document.body.removeChild(this.element);
            this.element = null;
        }
    };

    module.exports = Modal;
});
