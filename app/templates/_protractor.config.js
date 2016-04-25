var gulpConfig = require('./gulp.config')();

exports.config = {
  baseUrl: 'http://localhost:' + gulpConfig.defaultPort,
  specs: gulpConfig.scenarios
};
