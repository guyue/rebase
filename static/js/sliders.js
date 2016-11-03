define(function (require) {
    'use strict';

    var slider = require('../plugin/slider');
    var result = document.querySelector('#result');

    var sliderExample = slider(document.querySelector('#slider-example'));
    sliderExample.on('slidestart', function (e) {
        if (Math.random() > 0.5) {
            e.preventDefault();
            console.log(e.type, 'prevented');
            result.innerHTML = e.type + ', ' + 'prevented';
        } else {
            console.log(e.type);
            result.innerHTML = e.type;
        }
    }).on('slidestarted', function (e) {
        console.log(e.type);
        result.innerHTML = e.type;
    }).on('slidemoved', function (e) {
        console.log(e.type);
        result.innerHTML = e.type;
    }).on('slideended', function (e) {
        console.log(e.type);
        result.innerHTML = e.type;
    });
});
