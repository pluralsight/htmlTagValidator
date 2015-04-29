var expect            = require('chai').expect
    fs                = require('fs'),
    _                 = require('lodash'),
    htmlTagValidator  = require('../index'),
    tree              = require('./helpers.js');

describe('html-tag-validator', function() {
  it('basic-div', function(done) { 
    tree.ok(this, done); 
  });

  // it('anchor-tags', function(done) { 
  //   tree.ok(this, done); 
  // });

  // it('basic-angular', function(done) { 
  //   tree.ok(this, done); 
  // });

  // it('malformed-attribute', function (done) {
  //   tree.error("Found an attribute assignment \"=\" not followed by a value", this, done);
  // });
});