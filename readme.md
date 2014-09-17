`node-inspector --config ./inspector-config.json & node --debug app.js`
`node-inspector --config ./inspector-config.json & ./node_modules/mocha/bin/mocha --debug closingTagSpec.js`


## To run with node-inspector:
In one terminal window run: `mocha -w --debug-brk closingTagSpec.js`
In a second terminal window run: `node-inspector --config ./inspector-config.json`
Vist the site given
