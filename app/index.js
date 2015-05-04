'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var generators = yeoman.generators;
var yosay = require('yosay');
var chalk = require('chalk');

var HotTowelGenerator = generators.Base.extend({

    constructor: function() {
        // arguments and options should be
        // defined in the constructor.
        generators.Base.apply(this, arguments);

        this.argument('appName', { type: String, required: false });
        this.appName = this._.camelize(this._.slugify(this._.humanize(this.appName)));
    },

    welcome: function() {
        this.log(yosay(
            'Welcome to the HotTowel AngularJS generator!'
        ));
    },

    prompting: function () {
        // If we passed in the app name, don't prompt the user for it
        if(this.appName) {
            return;
        }

        var done = this.async();

        var prompts = [{
            type: 'input',
            name: 'appName',
            message: 'What would you like to name the app?',
            default: this.appName || path.basename(process.cwd())
        }];

        this.prompt(prompts, function (answers) {
            this.appName = answers.appName;
            this.appName = this.appName || 'hottowel'; //path.basename(process.cwd());
            done();
        }.bind(this));
    },

    displayName: function() {
        this.log('Creating ' + this.appName + ' app based on HotTowel.');
    },

    scaffoldFolders: function () {
        this.mkdir('src');
        this.mkdir('src/client');
        this.mkdir('src/client/app');
        this.mkdir('src/server');
    },

    packageFiles: function () {
        var context = {
            appName: this.appName
        };

        this.copy('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_gulpfile.js', 'gulpfile.js');
        this.template('_gulp.config.js', 'gulp.config.js');
        this.template('_karma.conf.js', 'karma.conf.js');
        this.template('_README.md', 'README.md');
    },

    assets: function () {
        this.copy('gulp.png', 'gulp.png');
    },

    testRunnerFiles: function () {
        this.template('src/client/_specs.html', 'src/client/specs.html');
    },

    appFiles: function () {
        this.directory('src/client/app');
        this.directory('src/client/images');
        this.directory('src/client/styles');
        this.directory('src/client/test-helpers');

        this.template('src/client/_index.html', 'src/client/index.html');

        this.template('src/server/_app.js', 'src/server/app.js');
        this.template('src/server/_data.js', 'src/server/data.js');
        this.template('src/server/_routes.js', 'src/server/routes.js');
        this.directory('src/server/utils');
        this.copy('src/server/favicon.ico');
    },

    projectfiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('jscsrc', '.jscsrc');
        this.copy('bowerrc', '.bowerrc');
        this.copy('gitignore', '.gitignore');
    },

    runNpm: function () {
//        var done = this.async();
//        this.npmInstall('', function () {
//            console.log('\nEverything Setup!\n');
//            done();
//        });
              this.npmInstall();
//              this.bowerInstall();
              console.log('\nEverything Setup !!!\n');
    },

    end: function () {
//        this.installDependencies();
    }
});

module.exports = HotTowelGenerator;
