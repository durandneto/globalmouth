var gulp = require('gulp') 
, jsdoc = require("gulp-jsdoc");
 
gulp.task('jsdoc', function() {
  gulp.src("./*.js")
  .pipe(jsdoc('./../doc/jsdoc'));
}); 