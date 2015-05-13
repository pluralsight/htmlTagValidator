var expect            = require('chai').expect
    tree              = require('./helpers');

describe('html-tag-validator', function() {
  it('basic div', function(done) {
    var resultTree = '{"doctype":null,"document":[{"type":"element","void":false,"name":"p","attributes":{"class":"string class names","data-quote":"tagvalue"},"children":[{"type":"text","contents":"simple content"}]}]}';
    tree.equals(resultTree, this, done);
  });

  it('basic div 2', function(done) {
    var resultTree = '{"doctype":null,"document":[{"type":"element","void":false,"name":"div","attributes":{"class":"main wrapper main-head"},"children":[{"type":"element","void":false,"name":"p","attributes":{"class":"single-quote"},"children":[{"type":"text","contents":"This is our footer"}]},{"type":"element","void":false,"name":"h1","attributes":{"class":"test"},"children":[]}]}]}';
    tree.equals(resultTree, this, done);
  });

  it('basic div 3', function(done) {
    tree.error({
      'message': "The div element is missing part of its closing tag",
      'line': 1,
      'column': 1
    }, this, done);
  });

  it('basic div 4', function(done) {
    tree.error({
      'message': "The div element is missing part of its closing tag",
      'line': 1,
      'column': 6
    }, this, done);
  });

  it('basic div p', function(done) {
    tree.error("Expected open tag p to match closing tag div", this, done);
  });

  it('anchor tags', function(done) {
    var resultTree = '{"doctype":null,"document":[{"type":"element","void":false,"name":"a","attributes":{"id":"top"},"children":[]},{"type":"element","void":false,"name":"div","attributes":{},"children":[{"type":"element","void":false,"name":"ul","attributes":{},"children":[{"type":"element","void":false,"name":"li","attributes":{},"children":[{"type":"element","void":false,"name":"a","attributes":{"href":"http://www.google.com"},"children":[{"type":"text","contents":"Google"}]}]},{"type":"element","void":false,"name":"li","attributes":{},"children":[{"type":"element","void":false,"name":"a","attributes":{"href":"mailto:blastingoff@codeschool.com"},"children":[{"type":"text","contents":"Bug Us"}]}]},{"type":"element","void":false,"name":"li","attributes":{},"children":[{"type":"element","void":false,"name":"a","attributes":{"href":"#top"},"children":[{"type":"text","contents":"Go to top"}]}]}]}]}]}';
    tree.equals(resultTree, this, done);
  });

  it('basic document', function(done) {
    var resultTree = '{"doctype":null,"document":[{"type":"element","void":false,"name":"html","attributes":{},"children":[{"type":"element","void":false,"name":"head","attributes":{},"children":[{"type":"title","attributes":{},"contents":"hello world"}]},{"type":"element","void":false,"name":"body","attributes":{},"children":[{"type":"element","void":false,"name":"p","attributes":{"style":"color: pink;"},"children":[{"type":"text","contents":"my cool page"}]}]}]}]}';
    tree.equals(resultTree, this, done);
  });

  it('basic angular', function(done) {
    var resultTree = '{"doctype":null,"document":[{"type":"element","void":false,"name":"html","attributes":{"data-at2tr":"yaydata"},"children":[{"type":"element","void":false,"name":"head","attributes":{},"children":[{"type":"title","attributes":{},"contents":"my title"}]},{"type":"element","void":false,"name":"body","attributes":{"data-something":"yaydata"},"children":[{"type":"element","void":false,"name":"div","attributes":{"class":"main"},"children":[{"type":"element","void":false,"name":"h1","attributes":{"id":"main-head","title":"this is the hello world example"},"children":[{"type":"text","contents":"Hello you"}]},{"type":"element","void":false,"name":"button","attributes":{"(click)":"handleClick($event)"},"children":[]},{"type":"element","void":false,"name":"p","attributes":{"[innerhtml]":"model.body","data-complex":"tagvalue"},"children":[{"type":"text","contents":"Hello world"},{"type":"element","void":false,"name":"strong","attributes":{},"children":[{"type":"text","contents":"I\'m bold!"}]},{"type":"text","contents":"Yes you are"}]}]},{"type":"element","void":true,"name":"input","attributes":{"type":"checkbox","checked":"checked"},"children":[]}]}]}]}';
    tree.equals(resultTree, this, {
      'attributes': {
        '_': {
         'mixed': /^((ng\-)|(^\[[\S]+\]$)|(^\([\S]+\)$))/
        }
      }
    }, done);
  });

  it('invalid input attribute', function(done) {
    tree.error("An input tag does not allow the value \"beez\" for the type attribute", this, done);
  });

  it('invalid input attribute 2', function(done) {
    tree.error("An input tag cannot have the list attribute when its type is set to \"radio\"", this, done);
  });

  it('invalid self closing', function(done) {
    tree.error("li is not a valid self closing tag", this, done);
  });

  it('basic list items', function(done) {
    tree.error({
      'message': "Expected open tag li to match closing tag ul",
      'line': 5

    }, this, done);
  });


  // TODO: Need to re-evaluate these two test once pre tag is fixed in 0.3.x
  it('basic pre', function(done) {
    tree.ok(this, done);
  });

  it('pre missing closing', function(done) {
    tree.error("Expected open tag pre to match closing tag div", this, done);
  });

  it('malformed attribute', function (done) {
    tree.error("Found an attribute assignment \"=\" not followed by a value", this, done);
  });

  it('malformed attribute 2', function (done) {
    tree.error("The div tag does not have a 12!#3 attribute", this, done);
  });

  it('malformed attribute 3', function (done) {
    tree.error("The div element has an attribute \"a\" with an invalid name", this, done);
  });

  it('malformed class value', function(done) {
    tree.error("Disallowed character "<" found in attribute value", this, done);
  });

  it('mismatched tags', function(done) {
    tree.error("Expected open tag h1 to match closing tag h2", this, done);
  });

  it('html comment', function(done) {
    tree.ok(this, done);
  });

  it('malformed comment', function(done) {
    tree.error("Cannot have two or more consecutive hyphens \"--\" inside of a block comment", this, done);
  });

  it('html comment conditional', function(done) {
    tree.ok(this, done);
  });

  it('html comment unclosed', function(done) {
    tree.error("Found an open HTML comment tag without a closing tag", this, done);
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
    tree.error("Found an open script tag without a closing script tag", this, done);
  });

  it('malformed script 2', function(done) {
    tree.error("A script tag with a src attribute cannot have content between the start and end tags", this, done);
  });

  it('invalid script attribute', function(done) {
    tree.error("The script tag async attribute should not have a value", this, done);
  });

  it('invalid script attribute 2', function(done) {
    tree.error("The script tag src attribute requires a value", this, done);
  });

  it('invalid script attribute 3', function(done) {
    tree.error("The script tag does not have a bees attribute", this, done);
  });

  it('basic style', function(done) {
    tree.ok(this, done);
  });

  it('malformed nested tag', function(done) {
    tree.error("The p element is missing part of its opening tag", this, done);
  });

  it('doctype', function(done) {
    tree.ok(this, done);
  });

  it('invalid doctype', function(done) {
    tree.error("The doctype definition for an HTML 5 document should be \"html\"", this, done);
  });

  it('invalid doctype 2', function(done) {
    tree.error("The doctype definition must be placed at the beginning of the first line of the document", this, done);
  });

  it('full featured test', function(done) {
    tree.ok(this, {
      'attributes': {
        'table': {
          'normal': ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'frame', 'rules', 'summary', 'width']
        },
        'td': {
          'normal': ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'height', 'width']
        }
      }
    }, done);
  });

  it('full featured test 2', function(done) {
    tree.ok(this, {
      'attributes': {
        '_': {
          'mixed': [/^((ng\-)|(^\[[\S]+\]$)|(^\([\S]+\)$))/]
        },
        'nw-nav-item': {
          'normal': 'name'
        }
      }
    }, done);
  });

  it('full featured test 3', function(done) {
    tree.ok(this, {
      'attributes': {
        'table': {
          'normal': ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'frame', 'rules', 'summary', 'width']
        },
        'td': {
          'normal': ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'height', 'width']
        }
      }
    }, done);
  });
  // TODO: spec for wildcard attribute in options object

  describe('plain formatting', function () {
    it('error formatting', function(done) {
      tree.error("Disallowed character \"&\" found in attribute value", this, {
        'settings': {
          'format': 'plain'
        }
      }, done);
    });
  });

  describe('html formatting', function () {
    it('error formatting', function(done) {
      tree.error("Disallowed character &quot;&amp;&quot; found in attribute value", this, {
        'settings': {
          'format': 'html'
        }
      }, done);
    });
  });

  describe('markdown formatting', function () {
    it('error formatting', function(done) {
      tree.error("Disallowed character `&` found in attribute value", this, {
        'settings': {
          'format': 'markdown'
        }
      }, done);
    });
  });
});
