var through = require('through2');
var stream = require('stream');

/**
 * Create a through object stream that wraps the pipe returned by the given factory method
 * @param {function(stream.Readable):stream.Readable} method A factory method that returns a stream
 * @returns {stream.Through} A through stream that wraps the pipe
 */
module.exports = function(method) {
  'use strict';

  // input to the stream
  var input = new stream.Readable({ objectMode: true });
  input._read = function() {};

  // the through stream wrapper
  var wrapper = through.obj(function(file, encoding, done) {
    input.push(file);
    done();
  });

  // output from the user defined stream is pushed to the wrapper stream
  var pipes   = method(input);
  var isValid = ('on' in pipes) && (typeof pipes.on === 'function') && (pipes.on.length === 2);
  if (isValid) {
    pipes
      .on('data', function(file) {
        wrapper.push(file);
      })
      .on('end', function() {
        wrapper.push(null);
      });
  } else {
    throw new Error('The given factory method must return a readable stream.');
  }

  /**
   * Bypass the through stream and directly push values to the internal input stream
   * @param {...object} Any number of objects to add to the input
   * @return {stream.Through} The through stream on which the method was called
   */
  wrapper.input = function() {
    input.push.apply(input, Array.prototype.slice.call(arguments));
    return wrapper;
  };

  /**
   * Bypass the through stream and directly push <code>null</code> to the internal input stream to trigger
   * <code>end</code> event
   * @return {stream.Through} The through stream on which the method was called
   */
  wrapper.end = function() {
    input.push(null);
    return wrapper;
  };

  /**
   * A convenience for <code>.on('data', method)</code>
   * @param {function(string, function)} method The method to be called on the <code>data</code> event
   * @return {stream.Through} The through stream on which the method was called
   */
  wrapper.output = function(method) {
    wrapper.on('data', method);
    return wrapper;
  };

  /**
   * A convenience for <code>.on('end', method)</code>
   * @param {function(string, function)} method The method to be called on the <code>end</code> event
   * @return {stream.Through} The through stream on which the method was called
   */
  wrapper.done = function(method) {
    wrapper.on('end', method);
    return wrapper;
  };

  // complete
  return wrapper;
};
