# through-pipes

> Create a through stream that wraps/nests a number of pipe statements.


## Install

Install with [npm](https://npmjs.org/package/gulp-traceur-out).

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

This is a over simplistic example. Generally the transform will be something that you want to implement in a separate
package.

## Limitations

Suitable for object streams only.

## API

There are a number of other methods that are primarly of use where you wish to push input explicitly to the subroutine.

The following example pushes 3 files, and a stream <code>end</code> event, directly to the readable stream.

```
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

### input(...):self

Bypass the through stream and directly push values to the internal input stream

`{...object}` Any number of objects to add to the input

Returns `{stream.Through}` the through stream on which the method was called

### end():self

Bypass the through stream and directly push <code>null</code> to the internal input stream to trigger end.

Returns `{stream.Through}` the through stream on which the method was called

### output(method):self

A convenience for `.on('data', method)`.

`{function(string, function)}` The method to be called on the <code>data</code> event

Returns `{stream.Through}` the through stream on which the method was called

### done(method):self

A convenience for `.on('end', method)`.

`{function(string, function)}` The method to be called on the <code>end</code> event

Returns `{stream.Through}` the through stream on which the method was called