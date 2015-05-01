/* Helper Functions */
{
	// Monkey patching
	Array.prototype.textNode = function () {
		return this.join('').textNode();
	};

	String.prototype.textNode = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	Array.prototype.scriptify = function () {
		var script = this.join('').replace(/^\n+|\n+$/g, '');
		return script.textNode() !== '' ? script : null;
	};

	Array.prototype.tagify = function () {
		return this.textNode().toLowerCase();
	};

	// Codex of tag and attribute names
	var codex = {
		// Attribute types
		'global': [
			'accesskey', 'class', 'contenteditable', 'contextmenu', 'dir',
			'draggable', 'dropzone', 'hidden', 'id', 'lang', 'spellcheck',
			'style', 'tabindex', 'title', 'translate'
		],
		'event': [
			'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror',
			'onhashchange', 'onload', 'onmessage', 'onoffline', 'ononline',
			'onpagehide', 'onpageshow', 'onpopstate', 'onresize', 'onstorage',
			'onunload', 'onblur', 'onchange', 'oncontextmenu', 'onfocus',
			'oninput', 'oninvalid', 'onreset', 'onsearch', 'onselect',
			'onsubmit', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick',
			'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave',
			'ondragover', 'ondragstart', 'ondrop', 'onmousedown',
			'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup',
			'onmousewheel', 'onscroll', 'onwheel', 'oncopy', 'oncut',
			'onpaste', 'onabort', 'oncanplay', 'oncanplaythrough',
			'oncuechange', 'ondurationchange', 'onemptied', 'onended',
			'onerror', 'onloadeddata', 'onloadedmetadata', 'onloadstart',
			'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange',
			'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate',
			'onvolumechange', 'onwaiting', 'onerror', 'onshow', 'ontoggle'
		],
		// Tag types
		'self-closing': [
			'area','base','br','col','command','embed','hr',
			'img', 'input','keygen','link','meta','param',
			'source','track', 'wbr'
		]
	};

	// Validation Rules for special tag types
	var table = {
		'script': {
			'additional': ['global'],
			'required': [],
			'normal': ['charset', 'src', 'type'],
			'void': ['async', 'defer'],
			'rules': function scriptRules(attributes, contents) {
				if (attributes['src'] != null && contents.textNode() !== '') {
					// If the "src" attribute is present, the <script> element must be empty.
					return {
						'error': "A <script> tag with a src attribute cannot have contents between the start and end tags"
					};
				}
				return true;
			}
		},
		'style': {
			'additional': ['global', 'event'],
			'required': [],
			'normal': ['media', 'scoped', 'type'],
			'void': [],
			'rules': null
		},
		'title': {
			'additional': ['global'],
			'required': [],
			'normal': [],
			'void': [],
			'rules': function styleRules(attributes, contents) {
				if (contents === null) {
					return {
						'error': "The <title> tag is required to have content between the start and end tags"
					};
				}
				return true;
			}
		},
		'meta': {
			'additional': ['global'],
			'required': [],
			'normal': ['charset', 'content', 'http-equiv', 'name', 'scheme'],
			'void': [],
			'rules': function metaRules(attributes, contents) {
				if ((attributes['name'] != null || attributes['http-equiv'] != null) && attributes['content'] == null) {
					return {
						'error': "The <meta> tag content attribute must be defined if the name or http-equiv attributes are defined"
					};
				} else if ((attributes['name'] == null && attributes['http-equiv'] == null) && attributes['content'] != null) {
					return {
						'error': "The <meta> tag content attribute cannot be defined unless the name or http-equiv attributes are defined"
					};
				}
				return true;
			}
		},
		'link': {
			'additional': ['global', 'event'],
			'required': ['rel'],
			'normal': ['rel', 'crossorigin', 'href', 'hreflang', 'media', 'sizes', 'type'],
			'void': [],
			'rules': null
		},
		'iframe': {
			'additional': ['global', 'event'],
			'required': [],
			'normal': ['height', 'name', 'sandbox', 'seamless', 'src', 'srcdoc', 'width'],
			'void': [],
			'rules': null
		}
	};

	// Verification Functions

	function isSelfClosing(tag) {
		return has(codex['self-closing'], tag);
	}

	function isGlobalAttribute(attribute) {
		// Note: Global attributes also include attributes beginning with `data-`
		return has(codex['global'], attribute);
	}

	function isEventAttribute(attribute) {
		return has(codex['event'], attribute);
	}

	function isAttributeAllowed(tag, attribute, value) {
		var i, len, ref, shared, props = table[tag];
		// Ignore unknown tags and attributes of the format data-*, [*], or (*)
		if (props == null || /(^data\-)|(^\[[\S]+\]$)|(^\([\S]+\)$)/i.test(attribute)) {
			return true;
		}

		/*
			The tag is allowed if it:
			a) exists in normal and has any value,
			b) exists in void and has no value,
			c) or exists in additional and has any or no value
		*/
		if (has(props['normal'], attribute)) {
			if (value == null) {
				return {
					'error': "The <" + tag + "> tag " + attribute + " attribute requires a value"
				};
			}
			return true;
		} else if (has(props['void'], attribute)) {
			if (value != null) {
				return {
					'error': "The <" + tag + "> tag " + attribute + " attribute should not have a value"
				};
			}
			return true;
		} else if ((ref = props['additional']).length) {
			for (i = 0, len = ref.length; i < len; i++) {
			  shared = ref[i];
			  if (has(codex[shared], attribute)) {
			    return true;
			  }
			}
		}

    return {
			'error': "The <" + tag + "> tag does not have a " + attribute + " attribute"
		};
	}

	function checkAttributes(tag, attributes, contents) {
		var i, len, ref, req, name, value, rule, props, ok = {
			'value': attributes
		};

		// If the tag is not in the table then allow anything
		if (!has(table, tag)) { return ok; }

		props = table[tag];

		// Check if all the required attributes are present
		if (props['required'].length) {
			ref = props['required'];
			for (i = 0, len = ref.length; i < len; i++) {
			  req = ref[i];
			  if (!has(attributes, req)) {
			    return {
						'error': "The <" + tag + "> tag must include a " + req + " attribute"
					};
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
		if (has(props, 'rules') && (typeof props['rules'] === 'function')) {
			if ((rule = props['rules'](attributes, contents)) !== true) {
				return rule;
			}
		}

		return ok;
	}

	function validateSpecialTag(sot, sc, sct) {
		var attrs = checkAttributes(sot.name, sot.attributes, sc);
		if (sct === null) {
			return {
				'error': "Found open <" + sot.name + "> tag without closing </" + sot.name + "> tag"
			};
		} else if (sot.name !== sct.name) {
			return {
				'error': "Expected open tag <" + sot.name + "> to match closing tag </" + sct.name + ">"
			};
		} else if (attrs.error != null) {
			return attrs;
		}
		return true;
	}

	function isValidChildren(tag, attributes, children) {
		/*
			Special rules apply for the position of certain elements in the document.
			We can look at the children for specific elements to determine if
			anything is in a place it is not allowed.
		*/

		// TODO: If you omit the <title> tag, the document will not validate as HTML
		// TODO: You can not have more than one <title> element in an HTML document
		// TODO: The <link> element goes only in the <head> section of an HTML document
		// TODO: The <meta> element goes only in the <head> section of an HTML document
		// TODO: If the "scoped" attribute is not used, each <style> tag must be located in the <head> section.

		return true;
	}

	// Utility Functions

	function has(thing, item) {
		if (Array.isArray(thing) || thing.length) {
			return thing.indexOf(item) !== -1;
		} else if (thing.hasOwnProperty) {
			return thing.hasOwnProperty(item);
		}
		return false;
	}

	function stack(arr) {
		return (Array.isArray(arr) ? arr.map(function (elem) { return elem[1]; }) : []);
	}

	function collapse(arr) {
		if (Array.isArray(arr) && arr.length) {
			var i, len, n, obj, ref, v;
			obj = {};
			for (i = 0, len = arr.length; i < len; i++) {
			  ref = arr[i], n = ref.name, v = ref.value;
			  obj[n] = v;
			}
			return obj;
		} else {
			return {};
		}
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
	= ls:(!doctype_terminators .)* doctype_start dt:([a-zA-Z])+ s ex:(char+)? s ">"
	&	{ return dt.tagify() === 'doctype'; }
	{
		if (ls === null || stack(ls).textNode() === '') {
			if (ex.tagify() === 'html') {
				return {
					'value': ex.tagify()
				};
			}
			return {
				'error': "The DOCTYPE definition for an HTML 5 document should be <!DOCTYPE html>"
			};
		}
		return {
			'error': "The DOCTYPE definition must be placed at the beginning of the first line of the document"
		};
	}

doctype_start
	= "<!"

doctype_terminators
	= doctype_start
	/ "<iframe"

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
	/ normal_tag
	/ self_closing_tag

iframe_tag "IFRAME Element"
	= iot:(special_tag_open) ic:(start) ict:(special_tag_close)?
	& { return has(['iframe'], iot.name); }
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
	& { return has(['script', 'style', 'title'], sot.name); }
	{
		var err;
		if ((err = validateSpecialTag(sot, sc, sct)) !== true) {
			return error(err.error);
		} else if ((err = isValidChildren(sot.name, sot.attributes, sc)) !== true) {
			return error(err.error);
		}
		return {
			'type': sot.name,
			'attributes': sot.value,
			'contents': sc
		};
	}

special_tag_open
	= "<" s st:(special_tag_types) attrs:(tag_attribute)* s ">"
	{
		return {
			'name': st,
			'attributes': collapse(attrs)
		};
	}

special_tag_types
	= st:([a-z])+
	& { return ['script', 'style', 'title', 'iframe'].indexOf(st.tagify()) !== -1; }
	{ return st.tagify(); }

special_tag_content
	= scs:(special_tag_scan)
	{ return scs; }

special_tag_scan
	= cs:(!"</" char)*
	{ return stack(cs).scriptify();  }

special_tag_close
	= "<" s "/" s sc:(special_tag_types) s ">"
	{
		return {
			'name': sc
		};
	}

normal_tag "Tag"
	= otn:(open_tag) sp:(s) c:(content) ctn:(close_tag)
	& { return !isSelfClosing(otn.name) || otn.name === ctn.name; }
	{
		var err;
		if (otn.name !== ctn.name) {
			return error("Expected open tag <" + otn.name + "> to match closing tag </" + ctn.name + ">");
		} else if (isSelfClosing(otn.name)) {
			return error("The <" + otn.name + "> tag is a void element and should not have a closing tag");
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

self_closing_tag "Self-closing Tag"
	= ot:(open_tag)
	{
		if(!isSelfClosing(ot.name)) {
			return error("<" + ot.name + ">" + " is not a valid self closing tag");
		}

		if (false && ot.closing !== null) {
			/*
			TODO: Note - This is where you would toggle on/off the error thrown when using the XHTML
						method of a self-closing tag.
			*/
			return error("The XHTML self-closing tag format <" + ot.name + " /> is not allowed in HTML 5");
		}
		// Special rules for <link> and <meta>
		if (['link', 'meta'].indexOf(ot.name) !== -1) {
			var attrs = checkAttributes(ot.name, ot.attributes);
			if (attrs.error != null) {
				return error(attrs.error);
			}
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
	= "<" s t:(tagname) attrs:(tag_attribute)* s cl:("/")? s ">"
	{
		return { 'name': t, 'attributes': collapse(attrs), 'closing': cl};
	}

close_tag "Closing Tag"
	= "</" s t:(tagname) s ">"
	{ return { 'name': t }; }

/* HTML element attributes*/

tagname "Tag Name"
	= tns:([A-Za-z]) tne:([0-9A-Z_a-z-])*
	{ return [tns].concat(tne).tagify(); }

tag_attribute "Attribute"
  = e ta:(tag_attribute_name) t:(attr_assignment)?
	{
		return {
			'name': ta,
			'value': t
		};
	}

tag_attribute_name "Attribute Name"
	= s n:(![\/\>\"\'\= ] char)*
	& { return n.length; }
	{ return stack(n).tagify(); }

tag_attribute_value_dblquote "Attribute Value (Double Quoted)"
	=	tag_attribute_value_dblquote_empty
	/ tag_attribute_value_dblquote_value

tag_attribute_value_dblquote_value
	= '"' v:([^"])* '"'
	{ return v.textNode(); }

tag_attribute_value_dblquote_empty
	= '"' v:([\s])* '"'
	{ return ''; }

tag_attribute_value_singlequote "Attribute Value (Single Quoted)"
	=	tag_attribute_value_singlequote_empty
	/ tag_attribute_value_singlequote_value

tag_attribute_value_singlequote_value
	= "'" v:([^'])* "'"
	{ return v.textNode(); }

tag_attribute_value_singlequote_empty
	= "'" v:([\s])* "'"
	{ return ''; }

tag_attribute_value_noquote "Attribute Value (Unquoted)"
	= v:([^\=\'\"\<\>` ])+
	{ return v.textNode(); }

tag_attribute_value "Attribute Value"
	= tag_attribute_value_dblquote
	/ tag_attribute_value_singlequote
	/ tag_attribute_value_noquote

attr_assignment "Attribute Assignment"
	= s "=" s i:tag_attribute_value?
	{
		if(i === null) {
			return error("Found an attribute assignment \"=\" not followed by a value");
		}
		return i;
	}

/* HTML text element*/

text_node "Text Node"
= tn:(char)+
{
	return {
		'type': 'text',
		'contents': tn.textNode()
	};
}

/* HTML block comments*/

comment "Block Comment"
	= comment_open com:(comment_content) comment_close
	{ return com; }

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
		var tn = cb !== null ? cb.textNode() : '';
		if(tn.indexOf('--') !== -1) {
			return error("Cannot have two or more consecutive hyphens inside of a block comment");
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
	= cs:(!comment_close char)*
	{ return stack(cs).textNode();  }

/* HTML conditional block comments*/

comment_conditional
	= s cons:(conditional_start)? s com:(comment_nodes) s cone:(conditional_end)? s
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
{ return csc.tagify(); }

conditional_end
	= "<!" s "[" s "endif" s "]"
	{ return true; }

comment_conditional_body
	= ccb:(conditional_scan)

conditional_scan
	= cs:(!conditional_terminator char)*
	{ return stack(cs).textNode(); }

conditional_terminator
	= conditional_end
	/ comment_close

/* Generic rules*/

char "Character"
	= [^<>]

e "Enforced Whitespace"
	= _+

s "Optional Whitespace"
	= _*

_ "Whitespace"
	= [ \f\n\r\t\v]
