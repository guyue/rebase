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
            'lib/chai/chai.js',
            'lib/seajs/sea.js',
            'lib/seajs-text/seajs-text.js',
            'js/config.js',
            {
                pattern: 'lib/jquery/jquery.js',
                included: false
            },
            {
                pattern: 'plugin/**/*.js',
                included: false
            },
            'plugin/**/*.spec.js'
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
