# htmlTagValidator
This library is used to validate certain aspects of HTML, currently closing tags and closing comments.

The usecase for this is if you are testing html, and need to indicate that closing tags are missing.
unclosed tags are hard to find in browser based methods since the browser and things like jQuery
will automatically close any unclosed tags, which is great for avoiding errors, but not so much
if you really want to know.
## Usage
npm install html-tag-validator

node:
```javascript
var validate = require('htmlTagValidator');
validate(<html string goes here>);
```

client:
```html
<script src="htmlTagValidator.js"></script>
<script>
  htmlTagValidator(<html string goes here>);
</script>
```

## Developing
To run within node-inspector:

* In one terminal window run: `mocha -w --debug-brk closingTagSpec.js`

* In a second terminal window run: `node-inspector --config ./inspector-config.json`
Vist the site given
