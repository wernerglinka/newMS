const gulp = require('gulp');
const googleWebFonts = require('gulp-google-webfonts');

const paths = require("./paths");

console.log(paths);
 
const options = { };
 
module.exports = function () {
  return gulp.src('gulp-tasks/fonts.list')
		.pipe(googleWebFonts(options))
		.pipe(gulp.dest(paths.fonts));
};

 
