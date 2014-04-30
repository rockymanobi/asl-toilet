var gulp = require("gulp");
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var Q = require('q');

fileNameMap = {
  "development": "dev.js",
  "production": "app.js"
};

gulp.task('sprockets', function(){
  console.log(fileNameMap[process.env.NODE_ENV]);
  gulp.src("")
    .pipe( shell([
      "sprockets -I src src/<%= fileNameMap[process.env.NODE_ENV] %> > build/application.js" ]));
});

gulp.task('watch', function(){
  var watcher = gulp.watch('src/**/*.js', ['sprockets']);
  watcher.on('change', function(event) {
    console.log('File '+event.path+' was '+event.type+', running tasks...');
  });
});

gulp.task('default', [ "sprockets" ],function() {
  // place code for your default task here
});



