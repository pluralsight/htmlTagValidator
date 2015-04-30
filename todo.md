Central issue to track progress of PEG.js version of html-tag-validator

- [x] Set up grunt and create tasks to automate development, testing, building, etc...
- HTML attributes
  - [x] Regular `value="bees"` and `value='bees'`
  - [x] Attributes without quotes `value=1`
  - [x] Attributes without values `checked`
  - [x] Angular 2.0 values `[checked]="true"` `(click)="myFunc()"`
  - [x] Inline `style` declarations `style="color: bold; content: 'my text';"`
  - [x] Inline JavaScript in event attributes `click="run(event)"`
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
  - [x] parse text nodes
``` html
<p>
  text node
  <strong>content within strong tag</strong>
</p>
```
- Comment nodes
  - [x] parse block comments
``` html
<!--This is a comment. Comments are not displayed in the browser-->
```
- Conditional comments
  - [x] parse conditional comments
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
      - `element`
        - [x] self-closing
```
type:       element
void:       true
name:       div
attributes: {}
children:   []
```
        - [x] closing
```
type:       element
void:       false
name:       div
attributes: {}
children:   []
```
      - [ ] `script`
      - [ ] `style`
      - [x] `text`
```
type:     text
contents: Hello there
```
      - `comment`
        - [x] block comment
```
type:        comment
conditional: false
condition:   null
children:
  type:     text
  contents: Some sort of html comment
```
        - [x] conditional block comment
```
type:        comment
conditional: true
condition:   if ie 8
children:
  type:       element
  void:       false
  name:       p
  attributes: {}
  children:
    -
      type:     text
      contents: IE is version 8!
```
  - [ ] Have parser export AST

  - AST spec (in progress)
``` json
{
  "document": {
    "type": "element",
    "void": false,
    "name": "html",
    "attributes": { },
    "children": [
      {
        "type": "element",
        "void": false,
        "name": "head",
        "attributes": {},
        "children": [
          {
            "type": "script",
            "contents": "function myFunc() { console.log('hello, world!'); };"
          },
          {
            "type": "script",
            "attributes": {
              "type": "javascript",
              "src": "path/to/my/script.js"
            },
            "contents": null
          }
        ]
      },
      {
        "type": "element",
        "void": false,
        "name": "body",
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
            "void": false,
            "name": "p",
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
}
```
