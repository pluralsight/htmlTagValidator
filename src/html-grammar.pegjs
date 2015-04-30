/* Helper Functions */
{
	Array.prototype.textNode = function () {
		return this.join('').textNode();
	};

	String.prototype.textNode = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	Array.prototype.tagify = function () {
		return this.textNode().toLowerCase();
	};

	function isSelfClosing(tagName) {
		var selfClosingTags = ['area','base','br','col','command','embed','hr','img',
													 'input','keygen','link','meta','param','source','track','wbr'];
		return selfClosingTags.indexOf(tagName) !== -1;
	}

	function stack(arr) {
		return (Array.isArray(arr) ? arr.map(function (elem) { return elem[1]; }) : []).textNode();
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
	= s:(content)
	{
		return {
			document: s
		};
	}

tag "HTML Tag"
 	= normal_tag
	/ self_closing_tag

normal_tag "Tag"
	= otn:open_tag ! { return isSelfClosing(otn.name) } s c:content ctn:close_tag
	{
		if(otn.name !== ctn.name) {
			return error("Expected open tag <" + otn.name + "> to match closing tag <" + ctn.name + ">");
		}
		return {
			'type': 'element',
			'void': false,
			'name': otn.name,
			'attributes': otn.attributes,
			'children': c
		};
		// return  "<" + otn + ">" + c + "</" + ctn + ">";
	}

self_closing_tag "Self-closing Tag"
	= ot:open_tag
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

tagname "Tag Name"
	= tns:([A-Za-z]) tne:([0-9A-Z_a-z-])*
	{ return tns.textNode() + tne.textNode(); }

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

comment "Block Comment"
	= comment_open com:(comment_content) comment_close
	{ return com; }

comment_nodes "Comment Node Types"
	= tag
	/ text_node

conditional_start
	= "[" s csc:([^\]]+)? s "]>"
{ return csc.tagify(); }

conditional_end
	= "<!" s "[" s "endif" s "]"
	{ return true; }

comment_open "Comment Start"
	= "<!--"

comment_close "Comment Close"
	= "-->"

comment_content
	= comment_conditional
	/ comment_block

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

comment_conditional_body
	= ccb:(conditional_scan)

conditional_scan
	= cs:(!comment_terminator char)*
	{ return stack(cs); }

comment_terminator
	= conditional_end
	/ comment_close

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
	{ return stack(cs);  }

tag_attribute "Attribute"
  = e ta:(tag_attribute_name) t:(attr_assignment)?
	{
		return {
			'name': ta,
			'value': t
		};
	}

tag_attribute_name "Attribute Name"
	= n:([^\t\n\f \/\>\"\'\=])+ s
	{ return n.tagify(); }

tag_attribute_value_dblquote "Attribute Value (Double Quoted)"
	=	tag_attribute_value_dblquote_value
	/ tag_attribute_value_dblquote_empty

tag_attribute_value_dblquote_value
	= '"' v:([^"])* '"'
	{ return v.textNode(); }

tag_attribute_value_dblquote_empty
	= '"' v:([\s])* '"'
	{ return ''; }

tag_attribute_value_singlequote "Attribute Value (Single Quoted)"
	=	tag_attribute_value_singlequote_value
	/ tag_attribute_value_singlequote_empty

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
	= "=" s i:tag_attribute_value?
	{
		if(i === null) {
			return error("Found an attribute assignment \"=\" not followed by a value");
		}
		return i;
	}

text_node "Text Node"
	= tn:(char)+
	{
		return {
			'type': 'text',
			'contents': tn.textNode()
		};
	}

char "Character"
	= [^<>]

e "Enforced Whitespace"
	= _+

s "Optional Whitespace"
	= _*

_ "Whitespace"
	= [ \f\n\r\t\v]
