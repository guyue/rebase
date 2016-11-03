define(function (require) {
    'use strict';

    var slider = require('../plugin/slider');

    var sliderExample = slider(document.querySelector('#slider-example'));
    sliderExample.on('slidestart', function (e) {
        if (Math.random() > 0.5) {
            e.preventDefault();
            console.log(e.type, 'prevented');
        } else {
            console.log(e.type);
        }
    }).on('slidestarted', function (e) {
        console.log(e.type);
    }).on('slidemoved', function (e) {
        console.log(e.type);
    }).on('slideended', function (e) {
        console.log(e.type);
    });
});
