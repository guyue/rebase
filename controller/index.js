module.exports = {
    index: function *() {
        this.state.title = 'REBASE';
        yield this.render('index', {
            csrf: this.csrf,
        });
    },
};
