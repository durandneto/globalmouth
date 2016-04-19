var gulp = require('gulp')
, browserify = require('gulp-browserify')
, jade = require('gulp-jade')
, copy2 = require('gulp-copy2')
, autoprefixer = require('gulp-autoprefixer')
, sass = require('gulp-sass')
, jsdoc = require("gulp-jsdoc");

gulp.task('browserify', function() {
  return gulp.
    src('./development/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./dist/bin'));
});

gulp.task('templates', function() {   
  gulp.src('./development/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist'))
});

gulp.task('index_production', function() {   
  gulp.src('./development/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
}); 

gulp.task('jsdoc', function() {
  gulp.src("./development/*.js")
  .pipe(jsdoc('./../doc/jsdoc'));
}); 

gulp.task('sass', function () {
  var autoprefixerOpts = {
    browsers: [
      'last 1 versions'
    ],
    cascade: false
  };

  return gulp.src('./development/sass/styles.sass')
    .pipe(sass({outputStyle: 'compressed'}))
    .on('error', function(err){
      console.error(err.message);
    })
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(gulp.dest('./dist/css'))

});

gulp.task('copy:libs', function () {
    var paths = [ 
        {src: './development/fonts/MuseoSansCyrl_0.otf', dest: './dist/fonts/'},
        {src: './node_modules/angular/angular.js', dest: './dist/libs/angular/angular/'},
        {src: './node_modules/angular-aria/angular-aria.js', dest: './dist/libs/angular/angular-aria/'},
        {src: './node_modules/angular-animate/angular-animate.js', dest: './dist/libs/angular/angular-animate/'},
        {src: './node_modules/angular-material/angular-material.js', dest: './dist/libs/angular/angular-material/'},
        {src: './node_modules/angular-material/angular-material.css', dest: './dist/libs/angular/angular-material/'},
        {src: './node_modules/angular-ui-router/release/angular-ui-router.min.js', dest: './dist/libs/angular/angular-ui-router/'}
    ];
    return copy2(paths);
});

gulp.task('copy:assets', function () {
    var paths = [ 
        {src: './development/assets/*', dest: './dist/assets/'}
    ];
    return copy2(paths);
});

gulp.task('watch', function() {
  gulp.watch([
      './development/**/*.js'
      , './development/**/*.jade'
      , './development/templates/**/*.sass']
      , [
        'browserify'
        , 'templates'
        , 'sass']
      );
});


gulp.task('build:production', [
        'browserify'
        , 'templates'
        , 'sass'
        , 'copy:libs'
        , 'copy:assets'
        , 'jsdoc'
         ]);

