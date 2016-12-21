/* Helper Functions */
{
      // Parser utilities
  var _u = require('./html-parser-util'),
      esc = _u.escape,
      // Codex of tag and attribute names
      codex = require('./html-grammar-codex')(options);

  // Set error encoding
  _u.setFormat(codex);

  // Verification Functions

  function isSelfClosing(tag, path) {
    var usePath = path || 'tags/void',
        tags = _u.option(usePath, null, codex);
    return tags != null ? _u.customTest.apply(this, [usePath, tags, [tag]]) : false;
  }

  function canBeSelfClosing(tag) {
    return isSelfClosing(tag) || isSelfClosing(tag, 'tags/mixed');
  }

  function isAttributeAllowed(tag, attribute, value) {
    var i, len, ref, shared, props,
        that = this,
        attrTest = function (tst) {
          return _u.customTest.apply(that, ['attributes/' + tst, props[tst], [attribute, value]]);
        };

    // Find the rules for this tag in the options
    props = _u.option('attributes', [tag, '_'], codex);

    // Do not continue unless attribute options exist for this tag
    if (props == null) { return true; }

    /*
      The tag is allowed if it:
      a) exists in normal and has any value,
      b) exists in void and has no value,
      c) exists in mixed and has any or no value
      d) exists in conditional if conditions are met
    */
    if (_u.has(props, 'normal') && attrTest('normal')) {
      if (value == null) {
        return {
          'error': "The " + esc(tag) + " tag " + esc.attr(attribute) +
                   " attribute requires a value"
        };
      }
      return true;
    } else if (_u.has(props, 'void') && attrTest('void')) {
      if (value != null) {
        return {
          'error': "The " + esc(tag) + " tag " + esc.attr(attribute) +
                   " attribute should not have a value"
        };
      }
      return true;
    } else if (_u.has(props, 'mixed') && attrTest('mixed')) {
      return true;
    } else if (_u.has(props, 'conditional') && attrTest('conditional')) {
      // Does not need to be evaluated further here
      return true;
    } else if(_u.has(props, 'boolean') && attrTest('boolean')) {
      // boolean attributes just need to exist to be true
      return true
    }

    return {
      'error': "The " + esc(tag) + " tag does not have a " +
               esc.attr(attribute) + " attribute"
    };
  }

  function checkAttributes(tag, attributes, contents) {
    var i, len, ref, req, name, value, rule, props, err, ok = {
      'value': attributes
    }, names = Object.keys(attributes);

    // If there is any weird stuff in the names, do not continue
    for (i = 0, len = names.length; i < len; i++) {
      if (/[\/\>\"\'\= ]/.test(names[i])) {
        return {
          'error': 'The ' + esc(tag) + ' element has an attribute ' +
                   esc.attr(names[i]) + ' with an invalid name'
        };
      }
    }

    // If the tag is not in the codex then allow anything
    props = _u.option('attributes', [tag, '_'], codex);

    if (props == null) { return ok; }

    // Check if all the required attributes are present
    if (_u.has(props, 'required')) {
      ref = props['required'];
      for (i = 0, len = ref.length; i < len; i++) {
        req = ref[i];
        rule = _u.customTest.apply(this, ['attributes/required', req, [attributes, contents]]);
        if (rule !== true) {
          if (rule === false) {
            return {
              'error': "The " + esc(tag) + " tag must include a " + esc.attr(req) +
                       " attribute"
            };
          } else {
            return rule;
          }
        }
      }
    }

    // Make sure each attribute is allowed validated
    for (name in attributes) {
      value = attributes[name];
      if ((err = isAttributeAllowed(tag, name, value)) !== true) {
        return err;
      }
    }

    // Run any custom validation rules that exist
    if (_u.has(props, 'rules') && props['rules'] != null) {
      rule = _u.customTest.apply(this, ['attributes/rules', props['rules'], [attributes, contents, _u, codex]]);
      if (_u.has(rule, 'error')) {
        return rule;
      }
    }

    // Check conditional attributes
    if (_u.has(props, 'conditional')) {
      ref = props['conditions'];
      for (i = 0, len = ref.length; i < len; i++) {
        if (_u.isFunc(ref[i]) && (rule = ref[i].apply(this, [attributes, _u, codex])) !== true) {
          return rule;
        }
      }
    }

    return ok;
  }

  function validateSpecialTag(sot, sc, sct) {
    var attrs = checkAttributes(sot.name, sot.attributes, sc);
    if (sct === null) {
      return {
        'error': "Found an open " + esc(sot.name) + " tag without a closing " +
                 esc(sot.name) + " tag"
      };
    } else if (sot.name !== sct.name) {
      return {
        'error': "Expected open tag " + esc(sot.name) + " to match closing tag " +
                 esc(sct.name) + ""
      };
    } else if (attrs.error != null) {
      return attrs;
    }
    return true;
  }


  // TODO: Is it possible to move this to the codex?
   function isValidChildren(tag, attributes, children) {
    /*
      Special rules apply for the position of certain elements in the document.
      We can look at the children for specific elements to determine if
      anything is in a place it is not allowed.
    */
    // TODO: Each of these needs a corresponding test
    var countTitle, countLink, countMeta;
    switch (tag) {
      case 'head':
        countTitle = _u.countWhere(children, {'type': 'title'});
        if (countTitle < 1) {
          return {
            'error': "The document will not validate as HTML if you omit the " +
                     esc('title') + " tag in the document " + esc('head') + " section"
          };
        } else if (countTitle > 1) {
          return {
            'error': "You can not have more than one " +
                     esc('title') + " element in an HTML document"
          };
        }
        break;
      default:
        if (_u.isArray(children) && children.length > 0) {
          countLink = _u.countWhere(children, {'type': 'element', 'name': 'link'});
          if (countLink > 0) {
            return {
              'error': "The " + esc('link') + " element goes only in the " +
                       esc('head') + " section of an HTML document"
            };
          }
          countMeta = _u.countWhere(children, {'type': 'element', 'name': 'meta'});
          if (countMeta > 0) {
            return {
              'error': "The " + esc('meta') + " element goes only in the " +
                       esc('head') + " section of an HTML document"
            };
          }
          // Process one level deep so that trace is as accurate as possible
          if (_u.find(children, function (child) {
            if (child['type'] === 'style' && !_u.has(child.attributes, 'scoped')) {
              return true;
            }
            return false;
          }) !== undefined) {
            return {
              'error': "If the " + esc.attr('scoped') + " attribute is not used, each " +
                       esc('style') + " tag must be located in the " +
                       esc('head') + " section"
            };
          }
        }
        break;
    }
    return true;
  }
}

/* Start Grammar */
start
  = dt:(doctype)? s st:(content)
  {
    var doct = null;
    if (dt !== null) {
      if (dt.error != null) {
        return error(dt.error);
      }
      doct = dt.value;
    }
    return {
      'doctype': doct,
      'document': st
    };
  }

/* HTML doctype definition */

doctype "HTML DOCTYPE"
/*= ls:([\s\S]* !doctype_terminators) doctype_start dt:([a-zA-Z])+ s ex:(charz) s ">"*/
  /*= ls:(!("<!" / ("<" [\s]* "iframe")) .)* "<!" dt:([a-zA-Z])+ s ex:(char+)? s ">"*/
  = ls:(!("<!" / ("<" s "iframe")) .)* "<!" dt:([a-zA-Z])+ s ex:([^>])* s ">"
  &	{ return _u.tagify(dt) === 'doctype'; }
  {
    if (ls === null || _u.textNode(ls) === '') {
      if (_u.tagify(ex) === 'html') {
        return {
          'value': _u.tagify(ex)
        };
      }
      return {
        'error': "The " + esc('DOCTYPE') +
                 " definition for an HTML 5 document should be " + esc.val('html')
      };
    }
    return {
      'error': "The " + esc('DOCTYPE') +
               " definition must be placed at the beginning of the first line of the document"
    };
  }

/* HTML node types*/

content "Content"
  = c:(node)*
  { return c; }

node "Node"
  = n:(node_types) s
  { return n; }

node_types "Node Types"
  = tag
  / comment
  / text_node

comment_nodes "Comment Node Types"
  = tag
  / text_node

/* HTML elements*/

tag "HTML Tag"
   = iframe_tag
  / special_tag
  / self_closing_tag_shortcut
  / normal_tag
  / self_closing_tag

iframe_tag "IFRAME Element"
  = iot:(special_tag_open) ic:(start) ict:(special_tag_close)?
  & { return _u.has(['iframe'], iot.name); }
  & { return ict === null || iot.name === ict.name; }
  {
    var err;
    if ((err = validateSpecialTag(iot, ic, ict)) !== true) {
      return error(err.error);
    } else if ((err = isValidChildren(iot.name, iot.attributes, ic)) !== true) {
      return error(err.error);
    }
    return {
      'type': iot.name,
      'attributes': iot.attributes,
      'contents': ic
    };
  }

special_tag "Non-parsed Element"
  = sot:(special_tag_open) sc:(special_tag_content) sct:(special_tag_close)?
  & { return _u.has(['script', 'style', 'title'], sot.name); }
  {
    var err;
    if ((err = validateSpecialTag(sot, sc, sct)) !== true) {
      return error(err.error);
    } else if ((err = isValidChildren(sot.name, sot.attributes, sc)) !== true) {
      return error(err.error);
    }
    return {
      'type': sot.name,
      'attributes': sot.attributes,
      'contents': sc
    };
  }

special_tag_open
  = "<" s st:(special_tag_types) attrs:(tag_attribute)* s ">"
  {
    return {
      'name': st,
      'attributes': _u.collapse(attrs)
    };
  }

special_tag_types
  = st:([a-z])+
  & { return ['script', 'style', 'title', 'iframe'].indexOf(_u.tagify(st)) !== -1; }
  { return _u.tagify(st); }

special_tag_content
  = cs:(!"</" .)*
  { return _u.scriptify(cs);  }

special_tag_close
  = "<" s "/" s sc:(special_tag_types) s ">"
  {
    return {
      'name': sc
    };
  }

normal_tag "Tag"
  = otn:(open_tag) sp:(s) c:(content) ctn:(close_tag)
  & { return !isSelfClosing(otn.name) /* || otn.name === ctn.name */; }
  {
    var err, attrs, parts = [];
    if (!otn.back) {
        return error("The " + esc(otn.name) + " element is missing part of its opening tag");
    } else if(!(ctn.front && ctn.back)) {
      // TODO: Find another solution without displaying unencoded brackets
      // if (!ctn.front) { parts.push('</'); }
      // if (!ctn.back) { parts.push('>'); }
      // return error("The <" + otn.name + "> tag is missing part (" + parts.join(', ') + ") of its closing tag");
      return error("The " + esc(otn.name) + " element is missing part of its closing tag");
    } else if (otn.name !== ctn.name) {
      return error("Expected open tag " + esc(otn.name) + " to match closing tag " + esc(ctn.name) + "");
    } /*else if (isSelfClosing(otn.name)) {
      return error("The " + esc(otn.name) + " tag is a void element and should not have a closing tag");
    }*/ else if (_u.has(attrs = checkAttributes(otn.name, otn.attributes, c), 'error')) {
      return error(attrs.error);
    } else if ((err = isValidChildren(otn.name, otn.attributes, c)) !== true) {
      return error(err.error);
    }
    return {
      'type': 'element',
      'void': false,
      'name': otn.name,
      'attributes': otn.attributes,
      'children': c
    };
  }

self_closing_tag_shortcut
  = "<" s t:(tagname) attrs:(tag_attribute)* s cl:("/") s e:(">") s
  {
    var attrs;
    if(!canBeSelfClosing(t)) {
      return error("" + esc(t) + "" + " is not a valid self closing tag");
    }

    if (_u.has(attrs = checkAttributes(t, _u.collapse(attrs)), 'error')) {
      return error(attrs.error);
    }

    return {
      'type': 'element',
      'void': true,
      'name': t,
      'attributes': attrs,
      'children': []
    };
  }


self_closing_tag "Self-closing Tag"
  = ot:(open_tag)
  {
    var attrs;
    if (!ot.back) {
      return error("The " + esc(ot.name) + " element is missing part of its opening tag");
    } else if(!isSelfClosing(ot.name)) {
      return error("" + esc(ot.name) + "" + " is not a valid self closing tag");
    }

    if (false && ot.closing !== null) {
      /*
      TODO: Note - This is where you would toggle on/off the error thrown when using the XHTML
            method of a self-closing tag.
      */
      return error("The XHTML self-closing tag format for " + esc(ot.name) + " is not allowed in HTML 5");
    } else if (_u.has(attrs = checkAttributes(ot.name, ot.attributes), 'error')) {
      return error(attrs.error);
    }

    return {
      'type': 'element',
      'void': true,
      'name': ot.name,
      'attributes': ot.attributes,
      'children': []
    };
    // return "<" + ot + ">";
  }

open_tag "Opening Tag"
  = "<" s t:(tagname) attrs:(tag_attribute)* s cl:("/")? s e:(">")? s
  {
    return {
      'name': t,
      'attributes': _u.collapse(attrs),
      'closing': cl,
      'back': e !== null
    };
  }

close_tag "Closing Tag"
  = o:("</")? s t:(tagname) s c:(">")?
  {
    return {
      'name': t,
      'front': o !== null,
      'back': c !== null
    };
  }

/* HTML element attributes*/

tagname "Tag Name"
  = tns:([A-Za-z]) tne:([0-9A-Z_a-z-])*
  { 
    var tn = [tns].concat(tne);
    return _u.option('settings/preserveCase', null, codex) ? _u.textNode(tn) : _u.tagify(tn);
  }

tag_attribute "Attribute"
  = e ta:(tag_attribute_name) t:(attr_assignment)?
  {
    return {
      'name': ta,
      'value': t
    };
  }

tag_attribute_name "Attribute Name"
  = s n:([^\=\/\\ <>]*)
  /*= s n:(![\/\>\"\'\= ] char)**/
  /*= s n:(![^\t\n\f \/>"'=] char)**/
  & { return n.length; }
  {
    return _u.option('settings/preserveCase', null, codex) ? _u.textNode(n) : _u.tagify(n);
  }

tag_attribute_value_dblquote "Attribute Value (Double Quoted)"
  =	tag_attribute_value_dblquote_empty
  / tag_attribute_value_dblquote_value

tag_attribute_value_dblquote_value
  = '"' v:([^"])* '"'
  { return { 'value': _u.textNode(v), 'unquoted': false }; }

tag_attribute_value_dblquote_empty
  = '"' v:([\s])* '"'
  { return { 'value': '', 'unquoted': false }; }

tag_attribute_value_singlequote "Attribute Value (Single Quoted)"
  =	tag_attribute_value_singlequote_empty
  / tag_attribute_value_singlequote_value

tag_attribute_value_singlequote_value
  = "'" v:([^'])* "'"
  { return { 'value': _u.textNode(v), 'unquoted': false }; }

tag_attribute_value_singlequote_empty
  = "'" v:([\s])* "'"
  { return { 'value': '', 'unquoted': false }; }

tag_attribute_value_noquote "Attribute Value (Unquoted)"
  = v:([^ >])+
  { return { 'value': _u.textNode(v), 'unquoted': true }; }

tag_attribute_value "Attribute Value"
  = tag_attribute_value_dblquote
  / tag_attribute_value_singlequote
  / tag_attribute_value_noquote

attr_assignment "Attribute Assignment"
  = s "=" s i:(tag_attribute_value)?
  {
    // NOTE: equal sign in <meta> tag attribute values, quotes in <style> tags
    var matches, disallowed;
    if(i == null) {
      return error("Found an attribute assignment " + esc.val('=') + " not followed by a value");
    } else {
      // TODO: Move this this check up to a place where tag name is available
      // TODO: & could be allowed in event attributes
      if (i.unquoted) {
        // Note: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(unquoted)-state
        disallowed = /[ \f\n\r\t\v\/<>&"'`=]+/;
      } else {
        // Note: https://html.spec.whatwg.org/multipage/syntax.html#attribute-value-(double-quoted)-state
        disallowed = /(&(?![^\s]+;)+)/;
      }
      if (disallowed.test(i.value)) {
        matches = i.value.match(disallowed);
        return error("Disallowed character " + esc.val(matches[0]) + " found in attribute value");
      }
    }
    return _u.option('settings/verbose', null, codex) ? i : i.value;
  }

/* HTML text element*/

text_node "Text Node"
= tn:(chars)
{
  return {
    'type': 'text',
    'contents': tn
  };
}

/* HTML block comments*/

comment "Block Comment"
  = comment_open com:(comment_content) cc:(comment_close)?
  {
    if (cc === null) {
      return error('Found an open HTML comment tag without a closing tag');
    }
    return com;
  }

comment_open "Comment Start"
  = "<!--"

comment_close "Comment Close"
  = "-->"

comment_content
  = comment_conditional
  / comment_block

comment_block
  = s cb:comment_scan s
  {
    var tn = cb !== null ? _u.textNode(cb) : '';
    if(tn.indexOf('--') !== -1) {
      return error("Cannot have two or more consecutive hyphens " + esc.val('--') + " inside of a block comment");
    }
    return {
      'type': 'comment',
      'conditional': false,
      'condition': null,
      'children': {
        'type': 'text',
        'contents': tn
      }
    };
  }

comment_scan
  = cs:(!comment_close .)*
  { return _u.textNode(cs);  }

comment_conditional_scan
  = cs:(!conditional_end .)*
  { return _u.scriptify(cs);  }

/* HTML conditional block comments*/

comment_conditional
  = s cons:(conditional_start)? s com:(comment_conditional_scan) s cone:(conditional_end)? s
  ! { return cons === null && cone === null; }
  {
    var condition = '';
    if (cone === null) {
      return error("Conditional comment start tag found without conditional comment end tag");
    } else if (cons === null) {
      return error("Conditional comment end tag found without conditional comment start tag");
    } else {
      condition = cons;
    }
    return {
      'type': 'comment',
      'conditional': true,
      'condition': condition,
      'children': com
    };
  }

conditional_start
  = "[" s csc:([^\]]+)? s "]>"
{ return _u.tagify(csc); }

conditional_end
  = "<!" s "[" s "endif" s "]"
  { return true; }

comment_conditional_body
  = ccb:(conditional_scan)

conditional_scan
  = cs:(!conditional_terminator [^<>])*
  { return _u.textNode(cs); }

conditional_terminator
  = conditional_end
  / comment_close

/* Generic rules*/

any "Anything"
  /*= a:([\s\S])* { return _u.textNode(a); }*/
  /*= [\s\S]*/
  = .

chars "Characters"
  = c:([^<>])+ { return _u.textNode(c); }

e "Enforced Whitespace"
  = [ \f\n\r\t\v]+

s "Optional Whitespace"
  = [ \f\n\r\t\v]*
