/* Helper Functions */
{
	Array.prototype.textNode = function () {
		return this.join('').textNode();
	};

	String.prototype.textNode = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	Array.prototype.scriptify = function () {
		return this.join('').replace(/^\n+|\n+$/g, '');
	};

	Array.prototype.tagify = function () {
		return this.textNode().toLowerCase();
	};

	function isSelfClosing(tagName) {
		var selfClosingTags = ['area','base','br','col','command','embed','hr','img',
													 'input','keygen','link','meta','param','source','track','wbr'];
		return selfClosingTags.indexOf(tagName) !== -1;
	}

	function checkAttributes(tag, attributes) {
		var table = {
					'script': {
						'normal': ['charset', 'src', 'type'],
						'void': ['async', 'defer']
					},
					'style': {
						'normal': ['media', 'scoped', 'type'],
						'void': []
					}
				}, inNormal, inVoid, name, value;
		for (name in attributes) {
		  value = attributes[name];
		  inVoid = table[tag]['void'].indexOf(name) !== -1;
		  inNormal = table[tag]['normal'].indexOf(name) !== -1;
		  if (!(inVoid || inNormal)) {
		    return error("The <" + tag + "> tag does not have a " + name + " attribute");
		  }
		  if (value != null) {
		    if (!inNormal) {
		      return error("The <" + tag + "> tag " + name + " attribute should not have a value");
		    }
		  } else {
		    if (!inVoid) {
		      return error("The <" + tag + "> tag " + name + " attribute requires a value");
		    }
		  }
		}
		return true;
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
	= ls:(!"<!" .)* "<!" dt:([a-zA-Z])+ s ex:(char+)? s ">"
	&	{ return dt.tagify() === 'doctype'; }
	{
		if (ls === null || ls.textNode() === '') {
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
 	= script_tag
	/ normal_tag
	/ self_closing_tag

script_tag
	= sot:(script_open) sc:(script_content) sct:(script_close)?
	{
		var err;
		if (sct === null) {
			return error("Found open <" + sot.name + "> tag without closing </" + sot.name + "> tag");
		} else if (sot.name !== sct.name) {
			return error("Expected open tag <" + sot.name + "> to match closing tag </" + sct.name + ">");
		} else if ((err = checkAttributes(sot.name, sot.attributes)) !== true) {
			return err;
		}
		return {
			'type': sot.name,
			'attributes': sot.attributes,
			'content': sc
		};
	}

script_open
	= "<" s st:(script_types) attrs:(tag_attribute)* s ">"
	{
		return {
			'name': st,
			'attributes': collapse(attrs)
		};
	}

script_types
	= st:([a-z])+
	& { return ['script', 'style'].indexOf(st.tagify()) !== -1; }
	{ return st.tagify(); }

script_content
	= scs:(script_scan)
	{ return scs; }

script_scan
	= cs:(!"</" char)*
	{ return stack(cs).scriptify();  }

script_close
	= "<" s "/" s sc:(script_types) ">"
	{
		return {
			'name': sc
		};
	}

normal_tag "Tag"
	= otn:(open_tag) ! { return isSelfClosing(otn.name) } s c:(content) ctn:(close_tag)
	{
		if (otn.name !== ctn.name) {
			return error("Expected open tag <" + otn.name + "> to match closing tag </" + ctn.name + ">");
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
	= "<" t:(tagname) attrs:(tag_attribute)* s cl:("/")? s ">"
	{
		return { 'name': t, 'attributes': collapse(attrs)};
	}

close_tag "Closing Tag"
	= "</" t:(tagname) ">"
	{ return { 'name': t }; }

/* HTML element attributes*/

tagname "Tag Name"
	= tns:([A-Za-z]) tne:([0-9A-Z_a-z-])*
	{ return tns.textNode() + tne.textNode(); }

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
