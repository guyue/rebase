'use strict';

const fs = require('fs');

function getIcons() {
    return function (done) {
        fs.readdir('static/sass/icons', done);
    };
}

module.exports = {
    index: function *() {
        this.state.title = 'REBASE';
        yield this.render('index', {
            csrf: this.csrf,
        });
    },

    icons: function *() {
        this.state.title = 'REBASE';

        let icons = yield getIcons();
        icons = icons.filter((icon) => {
            if (!/^\w+(?:-\w+)*\.(?:svg)$/i.test(icon)) {
                console.log('错误图片：', icon);
                return false;
            }
            return true;
        });

        yield this.render('icons', {
            csrf: this.csrf,
            icons: icons,
        });
    },
};
