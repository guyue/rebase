define(function (require) {
    'use strict';

    var modal = require('../plugin/modal');
    var $ = require('jquery');

    var tmplModal = document.querySelector('#modal-example');
    var nodeModal = tmplModal.content.firstElementChild.cloneNode(true);

    var modalExample = modal(nodeModal);

    $(nodeModal).on('open', function (e) {
        if (Math.round(Math.random())) {
            e.preventDefault();
            alert('Prevent you open the modal!!');
        }
    }).on('opened', function (e) {
        alert('Modal opened!!');
    }).on('close', function (e) {
        if (Math.round(Math.random())) {
            e.preventDefault();
            alert('Prevent you close the modal!!');
        }
    }).on('closed', function (e) {
        alert('Modal closed!!');
    });

    $('#btn-open').on('click', function (e) {
        e.preventDefault();
        modalExample.open();
    });

    $('#btn-destroy').on('click', function (e) {
        e.preventDefault();
        modalExample.destroy();
    });
});
