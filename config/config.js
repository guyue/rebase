'use strict';

const path = require('path');


let config = {

    title: 'Rebase',
    env: 'production',
    appName: 'REBASE',
    port: 18080,
    viewDir: path.join(__dirname, '..', 'view'),
    staticDir: path.join(__dirname, '..', 'static'),

};


module.exports = config;
