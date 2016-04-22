define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        common = require('./common');

    function Modal(element, options) {
        if (!(this instanceof Modal)) {
            return new Modal(element, options);
        }

        if (!(element instanceof HTMLElement)) {
            throw new TypeError('element参数应该是HTMLElement元素');
        }

        document.body.appendChild(element);
        this.element = element;
    }

    Modal.prototype = {
        constructor: Modal,

        getClose: function () {
            return common.query('[data-toggle=modal-close]', this.element);
        },

        open: function open() {
            if (this.element.classList.contains('active')) {
                return;
            }

            this.element.classList.add('active');

            $(this.getClose()).one('click.modal', this.close.bind(this));
        },

        close: function close(e) {
            if (e) {
                e.preventDefault();
            }

            this.element.classList.remove('active');
        },

        destory: function destroy() {
            $(this.getClose()).off('click.modal');
            document.body.removeChild(this.element);
        }
    };

    module.exports = Modal;
});
