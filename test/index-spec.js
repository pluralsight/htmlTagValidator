var expect            = require('chai').expect
    fs                = require('fs'),
    _                 = require('lodash'),
    htmlTagValidator  = require('../index'),
    tree              = require('./helpers.js');

describe('html-tag-validator', function() {
  it('basic div', function(done) {
    tree.ok(this, done);
  });

  it('anchor tags', function(done) {
    tree.ok(this, done);
  });

  it('basic angular', function(done) {
    tree.ok(this, done);
  });

  it('basic self closing', function(done) {
    tree.ok(this, done);
  });

  it('malformed attribute', function (done) {
    tree.error("Found an attribute assignment \"=\" not followed by a value", this, done);
  });

  it('html comment', function(done) {
    tree.ok(this, done);
  });

  it('malformed comment', function(done) {
    tree.error("Cannot have two or more consecutive hyphens inside of a block comment", this, done);
  });

  it('html comment conditional', function(done) {
    tree.ok(this, done);
  });

  it('malformed conditional comment', function(done) {
    tree.error("Conditional comment start tag found without conditional comment end tag", this, done);
  });

  it('malformed conditional comment 2', function(done) {
    tree.error("Conditional comment end tag found without conditional comment start tag", this, done);
  });
});
