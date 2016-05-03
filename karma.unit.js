// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'static/',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha'],

        client: {
            mocha: {
                reporter: 'html',
                ui: 'bdd'
            }
        },

        // list of files / patterns to load in the browser
        files: [
            {
                pattern: 'lib/chai/chai.js',
                included: true,
                watched: false
            },
            {
                pattern: 'lib/seajs/sea.js',
                included: true,
                watched: false
            },
            {
                pattern: 'lib/seajs-text/seajs-text.js',
                included: true,
                watched: false
            },
            {
                pattern: 'js/config.js',
                included: true,
                watched: false
            },
            {
                pattern: 'lib/jquery/jquery.js',
                included: false,
                watched: false
            },
            {
                pattern: 'plugin/**/*.js',
                included: false,
                watched: true
            },
            {
                pattern: 'plugin/**/*.spec.js',
                included: true,
                watched: true
            }
        ],

        // web server port
        port: 8080,

        proxies: {
            '/lib': '/base/lib',
            '/plugin': '/base/plugin'
        },

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome', 'PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
