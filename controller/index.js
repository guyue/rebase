'use strict';

const fs = require('fs');

function getIcons() {
    return function (done) {
        fs.readdir('static/sass/svgs', done);
    };
}

module.exports = {
    index: function *() {
        this.state.title = 'REBASE';
        yield this.render('index', {
            csrf: this.csrf,
        });
    },

    svgs: function *() {
        this.state.title = 'REBASE';

        let svgs = yield getIcons();
        svgs = svgs.filter((svg) => {
            if (!/^\w+(?:-\w+)*\.(?:svg)$/i.test(svg)) {
                console.log('错误图片：', svg);
                return false;
            }
            return true;
        });

        yield this.render('svgs', {
            csrf: this.csrf,
            svgs: svgs,
        });
    },

    icons: function *() {
        this.state.title = 'REBASE';

        let icons = yield getIcons();
        icons = icons.filter((icon) => {
            if (!/^\w+(?:-\w+)*\.(?:svg)$/i.test(icon)) {
                return false;
            }
            return true;
        }).map((icon) => {
            return icon.split('.')[0];
        });

        yield this.render('icons', {
            csrf: this.csrf,
            icons: icons,
        });
    },

    buttons: function *() {
        this.state.title = 'Buttons-REBASE';

        yield this.render('buttons', {
            csrf: this.csrf,
        });
    },
};
