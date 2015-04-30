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

  it('basic script', function(done) {
    tree.ok(this, done);
  });

  it('basic script 2', function(done) {
    tree.ok(this, done);
  });

  it('malformed script', function(done) {
    tree.error("Found open <script> tag without closing </script> tag", this, done);
  });

  it('invalid script attribute', function(done) {
    tree.error("The <script> tag async attribute should not have a value", this, done);
  });

  it('invalid script attribute 2', function(done) {
    tree.error("The <script> tag src attribute requires a value", this, done);
  });

  it('invalid script attribute 3', function(done) {
    tree.error("The <script> tag does not have a bees attribute", this, done);
  });

  it('basic style', function(done) {
    tree.ok(this, done);
  });

  it('doctype', function(done) {
    tree.ok(this, done);
  });

  it('invalid doctype', function(done) {
    tree.error("The DOCTYPE definition for an HTML 5 document should be <!DOCTYPE html>", this, done);
  });

  it('invalid doctype 2', function(done) {
    tree.error("The DOCTYPE definition must be placed at the beginning of the first line of the document", this, done);
  });
});
