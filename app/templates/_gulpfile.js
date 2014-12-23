var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var _ = require('lodash');
var path = require('path');
var $ = require('gulp-load-plugins')({lazy: true});

var colors = $.util.colors;
var env = $.util.env;
var port = process.env.PORT || config.defaultPort;

/**
 * env variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Lint the code and create coverage report
 * @return {Stream}
 */
gulp.task('analyze', ['plato'], function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(env.verbose, $.print()))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jscs());
});

/**
 * Create a visualizer report
 */
gulp.task('plato', function(done) {
    log('Analyzing source with Plato');

    startPlatoVisualizer(done);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.bytediff.start())
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(env.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(config.templateCache.file, {
            module: config.templateCache.module,
            standalone: false,
            root: config.templateCache.root
        }))
        .pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        }))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function() {
    var dest = config.build + 'images';
    log('Compressing and copying images');
    return gulp.src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 3
        }))
        .pipe(gulp.dest(dest));
});

//TODO: for testing
//gulp.task('less', function() {
//    gulp.watch(config.less, ['styles']);
//});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
//        .on('error', errorLogger) // more verbose and dupe output. requires emit.
        .pipe($.autoprefixer('last 2 version', '> 5%'))
        .pipe(gulp.dest(config.temp));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', function(done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            devDependencies: true
        }))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.testlibraries), {name: 'testlibraries', read: false}))
        .pipe($.inject(gulp.src(config.specHelpers), {name: 'spechelpers', read: false}))
        .pipe($.inject(gulp.src(config.specs), {name: 'specs', read: false}))
        .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 */
gulp.task('build', ['html', 'images', 'fonts'], function() {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('html', ['styles', 'templatecache', 'wiredep', 'analyze', 'test'], function() {
    log('Optimizing the js, css, and html');

    var assets = $.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssAllFilter = $.filter('**/*.css');
    var jsFilter = $.filter('**/app.js');
    var jslibFilter = $.filter('**/lib.js');

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, {read: false}), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets) // Gather all assets from the html with useref
        // Get the css
        .pipe(cssAllFilter)
        .pipe($.csso())
        .pipe(cssAllFilter.restore())
        // Get the custom javascript
        .pipe(jsFilter)
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsFilter.restore())
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore())
        // Take inventory of the file names for future rev numbers
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace the file names in the html with rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp, config.report);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean([].concat(config.build + 'fonts/**/*.*'), done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean([].concat(config.build + 'images/**/*.*'), done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );
    clean(files, done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function(done) {
    startTests(false /*singleRun*/ , done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['styles', 'wiredep'], function() {
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function() {
    serve(false /*isDev*/);
});

////////////////

/**
 * Add watches to build and reload using browserSync
 * @param  {Boolean} isDev - dev or build mode
 */
function addWatchForFileReload(isDev) {
    if (isDev) {
        gulp.watch([config.less], ['styles', browserSync.reload]);
        gulp.watch([config.client + '**/*', '!' + config.less], browserSync.reload)
            .on('change', function(event) { changeEvent(event); });
    }
    else {
        gulp.watch([config.less, config.js, config.html], ['html', browserSync.reload])
            .on('change', function(event) { changeEvent(event); });
    }
}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(specRunner) {
    if (env.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    } ;
    if (specRunner) { options.startPath = config.specRunnerFile; }
    browserSync(options);
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
    log('Running Plato');

    var files = glob.sync(config.plato.js);
    var excludeFiles = /.*\.spec\.js/;
    var plato = require('plato');

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = config.report + '/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        if (env.verbose) {
            log(overview.summary);
        }
        if (done) { done(); }
    }
}

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 */
function serve(isDev, specRunner) {
    var debug = env.debug || env.debugBrk;
    var exec;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    if (debug) {
        log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
        exec = require('child_process').exec;
        exec('node-inspector');
        nodeOptions.nodeArgs = [debug + '=5858'];
    }

    addWatchForFileReload(isDev);

    return $.nodemon(nodeOptions)
        .on('start', function() {
            startBrowserSync(specRunner);
        })
        .on('restart', function() {
            log('restarted!');
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        });
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var karma = require('karma').server;

    if (env.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer, childProcessCompleted);
    } else {
        excludeFiles.push(config.midwaySpecs);
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {
            child.kill();
        }
        done();
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Log an error message and emit the end of a task
 */
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}
