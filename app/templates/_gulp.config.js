module.exports = function() {
    var service = {
        getConfig: getConfig
    };
    return service;

    function getConfig() {
        var client = './src/client/';
        var server = './src/server/';
        var clientApp = client + 'app/';
        var specRunnerFile = 'specs.html';

        var config = {
            client: client,
            server: server,
            source: 'src/',
            htmltemplates: clientApp + '/**/*.html',
            less: client + '/styles/styles.less',
            html: client + '/**/*.html',
            index: client + '/index.html',
            js: [
                clientApp + '/**/*.module.js',
                clientApp + '/**/*.js',
                '!' + clientApp + '/**/*.spec.js'
            ],
            specs: [clientApp + '/**/*.spec.js'],
            alljs: [
                './src/**/*.js',
                './*.js'
            ],
            plato: {
                js: clientApp + '/**/*.js'
            },
            fonts: './bower_components/font-awesome/fonts/**/*.*',
            images: client + '/images/**/*.*',
            build: './build/',
            temp: './.tmp/',
            report: './report/',

            specHelpers: [client + '/test-helpers/*.js'],
            specRunner: client + specRunnerFile,
            specRunnerFile: specRunnerFile,
            midwaySpecs: client + '/test/midway/**/*.spec.js',
            testlibraries: [
                'node_modules/mocha/mocha.js',
                'node_modules/chai/chai.js',
                'node_modules/mocha-clean/index.js',
                'node_modules/sinon-chai/lib/sinon-chai.js'
            ],

            nodeServer: './src/server/app.js',
            defaultPort: '7203',
            browserReloadDelay: 1000,
            templateCache: {
                module: 'app.core',
                file: 'templates.js',
                root: 'app/'
            },
            bower: {
                directory: './bower_components/',
                ignorePath: '../..'
            }
        };

        return config;
    }
};
