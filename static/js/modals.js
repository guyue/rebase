define(function (require) {
    'use strict';

    var modal = require('../plugin/modal');
    var $ = require('jquery');

    var tmplModal = document.querySelector('#modal-example');

    var modalExample = modal(tmplModal.content.firstElementChild.cloneNode(true));

    $('.btn').on('click', function (e) {
        e.preventDefault();
        modalExample.open();
    });
});
