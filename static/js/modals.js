define(function (require) {
    'use strict';

    var modal = require('../plugin/modal');

    modal.live();
    setTimeout(function () {
        console.log('modal.die');
        modal.die();
    }, 10000);

    modal('button[data-toggle="modal-open"]');
    //modal('a[data-toggle="modal-open"]');
});
