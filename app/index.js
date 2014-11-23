'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var HottowelGenerator = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the HotTowel AngularJS generator!'
        ));

//        var prompts = [{
//            type: 'confirm',
//            name: 'expressServer',
//            message: 'Would you like to add an express server?',
//            default: true
//    }];

        this.expressServer = true;
        
//        this.prompt(prompts, function (props) {
//            this.expressServer = props.expressServer;
//
            done();
//        }.bind(this));
    },

    scaffoldFolders: function () {
        this.mkdir("src");
        this.mkdir("src/client");
        this.mkdir("src/client/app");
        if (this.expressServer) {
            this.mkdir("src/server");
        }
    },

    app: function () {
        this.src.copy('_package.json', 'package.json');
        this.src.copy('_bower.json', 'bower.json');
        this.src.copy('_gulpfile.js', 'gulpfile.js');
        this.src.copy('_gulp.config.json', 'gulp.config.json');
        this.src.copy('_karma.conf.js', 'karma.conf.js');

        this.directory('src/client/app');
        this.directory('src/client/content');
        this.directory('src/client/test');

        var context = {
            site_name: this.appName
        };

        this.template('src/client/_index.html', 'src/client/index.html', context);

        if (this.expressServer) {
            this.template('src/server/_app.js', 'src/server/app.js', context);
            this.copy('src/server/favicon.ico');
        }
    },

    projectfiles: function () {
        this.src.copy('editorconfig', '.editorconfig');
        this.src.copy('jshintrc', '.jshintrc');
        this.src.copy('jscsrc', '.jscsrc');
        this.src.copy('bowerrc', '.bowerrc');
    },

    runNpm: function () {
//        var done = this.async();
//        this.npmInstall('', function () {
//            console.log('\nEverything Setup!\n');
//            done();
//        });
              this.npmInstall();
//              this.bowerInstall();
              console.log("\nEverything Setup !!!\n");
    },

    end: function () {
//        this.installDependencies();
    }
});

module.exports = HottowelGenerator;