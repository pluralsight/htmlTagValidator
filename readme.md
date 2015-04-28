# html-tag-validator
This library takes some HTML source code, provided as a string, and generate an AST. An error will be thrown describing what is malformed in the source document if the AST cannot be generated.

## Install

```
npm install html-tag-validator
```

## Usage

``` javascript
var htmlTagValidator = require('html-tag-validator');
htmlTagValidator("<html></html>", function (err, ast) {
	console.log(ast);
});
```
