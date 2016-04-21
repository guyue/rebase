define(function (require, exports, module) {
    'use strict';

    exports.CustomEvent = (function () {
        if (window.CustomEvent) {
            return window.CustomEvent;
        }

        return function CustomEvent(type, eventInitDict) {
            var event = document.createEvent('CustomEvent');

            event.initCustomEvent(type,
                eventInitDict.canBubble,
                eventInitDict.cancelable,
                eventInitDict.detail);

            return event;
        };
    }());

    exports.query = function query(selector, content) {
        if (selector instanceof HTMLElement) {
            return selector;
        }

        if (!content) {
            content = document;
        }

        return content.querySelector(selector);
    };
});
