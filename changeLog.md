# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased][unreleased]

## [v1.0.8] - 2015-05-14
### Fixed
- Encoding error in codex file that contained odd tab character

## [v1.0.7] - 2015-05-14
### Changed
- Updated `markdown`, `html` and `plain` output for validation error output

## [v1.0.6] - 2015-05-14
### Fixed
- Gruntfile now set to monitor all project files in `grunt debug` watcher

### Changed
- Main exported function for this library can now work synchronously or asynchronously

```javascript
var validator = require('html-tag-validator');

// sync
var ast = validator("<p></p>", { 'settings': { 'format': 'html' } });

// async
validator("<p></p>", { 'settings': { 'format': 'html' } }, function (err, ast) {
  if (err) {
    throw err;
  } else {
    console.log(JSON.stringify(ast));
  }
});
```
### Added
- Global `settings` for error output `format` as `'plain'`, `'html'`, or `'markdown'`
- Escaping functions for identifiers and other values (for validation message generation)
- Added `conditional` and `conditions` sections to `attributes` definitions in the `options` object, so that conditional rules on allowed attributes can be written easier (e.g.: if the `type` attribute is `radio` then allow attributes `checked` and `required` on an `input` element, in addition to the `global` and `event` attributes)
- Testing: added ability to do deep equals against two HTML trees using `tree.equals()`

## [v1.0.5] - 2015-05-07
### Fixed
- Quoted attribute values did not follow [HTML 5 spec](https://html.spec.whatwg.org/)
- Unquoted attribute values did not follow [HTML 5 spec](https://html.spec.whatwg.org/)
- HTML parser utilities missing function `findWhere()` used by `has()` function
- Malformed starting tags gave wrong error message

  ``` html
  <div>
    <p class
    </p>
  </div>
  ```

- Having HTML or XML elements inside of a conditional comment caused parse errors

  ``` html
  <!--[if ie]>
    <style>
      .breaking {
        content: "whoops!";
      }
    </style>
  <![endif]-->
  ```

- Grunt `test` and `debug` should only failOnError when running pegjs compiler

## [v1.0.4] - 2015-05-07
### Added
- Grunt commands `test` for running tests and `debug` for getting detailed test output and starting the file watcher

### Changed
- Got rid of the dependency on `grunt-mocha-test` to run the tests

## [v1.0.3] - 2015-05-07
### Fixed
- Internal utility methods such as `textNode()` and `find()` no longer modify build-in JavaScript objects such as `Array` and `String`

## [1.0.2] - 2015-05-07
### Changed
- HTML encode all error messages so they can be displayed on a webpage

## [v1.0.0] - 2015-05-07

### Added
- Breaking changes from 0.0.x. Check README for changes to core API.

[unreleased]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.7...HEAD
[v1.0.8]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.7...v1.0.8
[v1.0.7]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.6...v1.0.7
[v1.0.6]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.5...v1.0.6
[v1.0.5]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.4...v1.0.5
[v1.0.4]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.3...v1.0.4
[v1.0.3]: https://github.com/codeschool/htmlTagValidator/compare/1.0.2...v1.0.3
[1.0.2]: https://github.com/codeschool/htmlTagValidator/compare/v1.0.0...1.0.2
[v1.0.0]: https://github.com/codeschool/htmlTagValidator/commit/ebb5423144a9faa8a51c93be98a90079ebe40cac
