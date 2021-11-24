const gulp = require('gulp');
const util = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require('browser-sync').create();

const paths = require("./paths");

module.exports = function styles() {
  console.log('Processing styles ************************');
  
  // only create a sourcemap in develop mode
  const withSourceMap = util.env.develop;

  return (
      gulp
          .src(paths.styles.src)
          .pipe(sourcemaps.init())
          .pipe(sass())
          .on("error", sass.logError)
          .pipe(postcss([autoprefixer(), cssnano()]))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(paths.styles.dest))
          // Add browsersync stream pipe after compilation
          .pipe(browserSync.stream())
  );
}