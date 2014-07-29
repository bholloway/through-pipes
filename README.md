# through-pipes

> Create a through stream that wraps/nests a number of pipe statements.


## Install

Install with [npm](https://npmjs.org/package/through-pipes).

```
npm install --save-dev through-pipes
```

## Usage

The primary use case is where you wish to define a subroutine that is to be used in a pipe statement. However in this
subroutine you would also like to pipe through a set of streams.

The following example encapsulates a `pre-minify` and `ugilfy` as a `minify` subroutine for Gulp.

```js
var through = require('through-pipes');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');

function minify() {
  return through(function(readable) {
    return readable
      .pipe(ngmin())
      .pipe(uglify())
  }
}

var gulp = require('gulp');

gulp.task('default', function() {
  gulp.src('js/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});
```

Note that minification is an arbitrary and somewhat inappropriate example. You would normally be implementing something
more specific that would be contained in a separate node package.

Other than the top-level factory method, there are a number of other methods that may be used to push input explicitly
to the subroutine.

The following example pushes 3 files, and a stream <code>end</code> event, directly to the readable stream.

```
var through = require('through-pipes');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');

through(function(readable) {
  return readable
    .pipe(ngmin())
    .pipe(uglify())
})
.output(function(file) {
  /* do something with each minified file */
})
.done(function() {
  /* do something at the end */
})
.input(fileA, fileB, fileC)
.end();
```

## Limitations

Suitable for object streams only.

## Reference

### (method)

Creates a new instance.

@param `{function(stream.Readable):stream.Readable} method` A factory method that returns a stream

@returns `{stream.Through}` A through stream that wraps the pipe

### .input(...)

Bypass the through stream and directly push values to the internal input stream.

@param `{...object}` Any number of objects to add to the input.

@returns `{stream.Through}` The through stream on which the method was called.

### .end()

Bypass the through stream and directly push `null` to the internal input stream to trigger end.

@returns `{stream.Through}` The through stream on which the method was called.

### .output(method)

A convenience for `.on('data', method)`.

@param `{function(string, function)} method` The method to be called on the `data` event.

@returns `{stream.Through}` The through stream on which the method was called.

### .done(method)

A convenience for `.on('end', method)`.

@param `{function(string, function)} method` The method to be called on the `end` event.

@returns `{stream.Through}` The through stream on which the method was called.