define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        common = require('./common');

    function Modal(element, options) {
        if (!(this instanceof Modal)) {
            return new Modal(element, options);
        }

        this.element = common.query(element);

        if ($(this.element).data('instance-modal')) {
            return $(this.element).data('instance-modal');
        } else {
            $(this.element).data('instance-modal', this);
        }

        this.target = this.getTarget();

        if (!(options && options.slient)) {
            $(this.element).on('click', this.show.bind(this));
        }
    }

    Modal.prototype = {
        constructor: Modal,

        getTarget: function () {
            var target = this.element.dataset.target;
            if (!target) {
                target = this.element.hash;
            }
            return common.query(target);
        },

        getClose: function () {
            return common.query('[data-toggle=modal-close]', this.target);
        },

        show: function show(e) {
            if (e) {
                e.preventDefault();
            }
            if (this.target.classList.contains('active')) {
                return;
            }
            this.target.classList.add('active');
            $(this.getClose()).one('click', this.hide.bind(this));
        },

        hide: function hide(e) {
            if (e) {
                e.preventDefault();
            }
            if (this.target.classList.contains('active')) {
                this.target.classList.remove('active');
            }
        }
    };

    Modal.live = function live() {
        Modal.die();

        $(document).on('click.modal', '[data-toggle=modal-open]', function (e) {
            var model = new Modal(this, {
                slient: true
            });
            model.show();
        });
    };

    Modal.die = function die() {
        $(document).off('click.modal');
    };

    module.exports = Modal;
});
