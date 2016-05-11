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

    // 抄录自：https://davidwalsh.name/vendor-prefix
    exports.browserCapabilities = (function () {
        var styles = window.getComputedStyle(document.documentElement, '');
        var text = styles.cssText || [].slice.call(styles).join(';');
        var prefix = (text.match(/(moz|webkit|ms)/) || (styles.OLink === '' && ['', 'o']))[1];

        return {
            prefix: '-' + prefix + '-',
            transform: prefix[0].toUpperCase() + prefix.substr(1) + 'Transform'
        };
    }());
});
