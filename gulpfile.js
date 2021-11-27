const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const util = require('gulp-util');

const paths = {
  styles: {
    src: "./styles/**/*.scss",
    dest: "./assets/styles"
  }
}

// get fonts
const processFonts = require('./gulp-tasks/get-google-fonts');
// process styles 
const processStyles = require('./gulp-tasks/process-styles');
// process scripts
const processScripts = require('./gulp-tasks/process-scripts');
// clean build folder
const cleanAssets = require('./gulp-tasks/clean');
// Metalsmith build site process
const metalsmith = require('./gulp-tasks/metalsmith');

// for "gulp", "util.env.production" will be undefined,"!!util.env.production" will coerce to boolean true
// for "gulp --production", "util.env.production" will be true
// source: https://j11y.io/javascript/truthy-falsey/
const isProduction = !!util.env.production;
// utility variable used to check all links
const isLinkCheck = !!util.env.linkcheck;

// Function to reload the browser
function reload(done) {
  browserSync.reload();
  done();
}

// Function to watch all relevant source files and update browser accordingly
// source: https://browsersync.io/docs/gulp
// this function is only used during site development
function watchSite(done) {
  if (!isProduction && !isLinkCheck) {
    browserSync.init({
      server: {
        baseDir: './build/',
      },
    });

    gulp.watch(
      'src/scripts/**/*.js',
      gulp.series(processScripts, metalsmith, reload)
    );
    gulp.watch(
      'src/styles/**/*.scss',
      gulp.series(processStyles,metalsmith, reload)
    );
    gulp.watch(
      ['src/*.md.njk, src/*.njk'],
      gulp.series(metalsmith, reload)
    );
  }
  done();
}


exports.default = gulp.series(
  cleanAssets,
  processScripts,
  processFonts,
  processStyles,
  metalsmith,
  watchSite
);

exports.buildProd = gulp.series(
  processFonts,
  processStyles,
  metalsmith
);
