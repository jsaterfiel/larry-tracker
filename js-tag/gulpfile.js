const gulp = require('gulp');
const closureCompiler = require('google-closure-compiler').gulp();
const sourcemaps = require('gulp-sourcemaps');

gulp.task('js-compile', function () {
  return gulp.src('./src/**/*.js', {base: './'})
    .pipe(closureCompiler({
      compilation_level: 'ADVANCED',
      warning_level: 'VERBOSE',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: '(function(){\n%output%\n}).call(this)',
      js_output_file: 'larry-tracker.min.js'
    }, {
      platform: ['native', 'java', 'javascript']
    }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('./dist'));
});