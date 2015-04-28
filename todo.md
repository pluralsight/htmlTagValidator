Central issue to track progress of PEG.js version of html-tag-validator

- [x] Set up grunt and create tasks to automate development, testing, building, etc...
- HTML attributes 
  - [x] Regular `value="bees"` and `value='bees'`
  - [x] Attributes without quotes `value=1`
  - [ ] Attributes without values `checked`
  - [x] Angular 2.0 values `[checked]="true"` `(click)="myFunc()"`
  - [ ] Inline `style` declarations `style="color: bold; content: 'my text';"`
  - [ ] Inline JavaScript in event attributes `click="run(event)"`
- Self-closing tags
  - [ ] Enforce whitelist of self-closing tags 
``` html
<img src="cat.gif" />
```
- HTML `doctype` declarations
  - [ ] Support `doctype` syntax and position 
``` html
<!DOCTYPE html>
```
- Special tags
  - [ ] `script` tags 
```html 
<script type="text/javascript" async src="cat.js"></script>
```
  - [ ] `style` tags 
```html 
<style type="text/css"></style>
```
  - [ ] `meta` tags 
``` html
<meta charset="UTF-8">
```
- Text nodes
  - [ ] parse text nodes
``` html
<p>
  text node
  <strong>content within strong tag</strong>
</p>
```
- Comment nodes
  - [ ] parse block comments
``` html
<!--This is a comment. Comments are not displayed in the browser-->
```
- Conditional comments
  - [ ] parse conditional comments
``` html
<!--[if gte mso 12]>
  <style>
    td {
      mso-line-height-rule: exactly;
    }
  </style>
<![endif]-->
```

- AST
  - [ ] Create standard AST format
    - Node types
      - [ ] `element`
        - [ ] self-closing
        - [ ] closing
      - [ ] `script`
      - [ ] `style`
      - [ ] `text` 
      - [ ] `comment`
  - [ ] Have parser export AST

  - AST spec (in progress)
``` json
{
  "type": "element",
  "selfClosing": false,
  "tagName": "html",
  "attributes": { },
  "children": [
    {
      "type": "element",
      "selfClosing": false,
      "tagName": "head",
      "attributes": {},
      "children": [
        {
          "type": "script",
          "content": "function myFunc() { console.log('hello, world!'); };"
        },
        {
          "type": "script",
          "attributes": {
            "type": "javascript",
            "src": "path/to/my/script.js"
          },
          "content": ""
        }
      ]
    },
    {
      "type": "element",
      "selfClosing": false,
      "tagName": "body",
      "attributes": {
        "class": "class1 class2",
        "bgcolor": "black"
      },
      "children": [
        {
          "type": "text",
          "content": "I am some text"
        },
        {
          "type": "element",
          "selfClosing": false,
          "tagName": "p",
          "attributes": {
            "id": "myPTag",
            "style": "font-weight: bold;"
          },
          "children": [
            {
             "type": "text",
             "content": "I am some more text"
            }
          ]
        }
      ]
    }
  ]
}
```