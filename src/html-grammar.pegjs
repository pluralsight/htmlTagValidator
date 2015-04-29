/* Helper Functions */
{
	Array.prototype.textNode = function () {
		return this.join('').textNode();
	};

	String.prototype.textNode = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};

	function isSelfClosing(tagName) {
		var selfClosingTags = ['area','base','br','col','command','embed','hr','img',
													 'input','keygen','link','meta','param','source','track','wbr'];
		return selfClosingTags.indexOf(tagName) !== -1;
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
 = normal_tag / self_closing_tag 

normal_tag "Tag"
	= otn:open_tag !{return isSelfClosing(otn.name)} c:content ctn:close_tag
	{
		if(otn.name !== ctn.name) {
			return error("Expected open tag <" + otn.name + "> to match closing tag <" + ctn.name + ">");
		}
		return {
			'type': 'element',
			'selfClosing': false,
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
			'selfClosing': true,
			'name': ot.name,
			'attributes': ot.attributes,
			'children': null
		};
		// return "<" + ot + ">";
	}

open_tag "Opening Tag"
	= "<" t:tagname attrs:(tag_attribute)* ">"
	{ return { 'name': t, 'attributes': attrs}; }

close_tag "Closing Tag"
	= "</" t:tagname ">"
	{ return { 'name': t }; }

tagname "Tag Name"
	= a:[A-Za-z] s:[0-9A-Z_a-z-]*
	{ return a + s.textNode(); }

content "Content"
	= s:(tag/text_node)*
	{ return s; }

tag_attribute "Attribute"
  = _+ ta:tag_attribute_name _* t:(attr_assignment)?
	{ 
		return {
			'name': ta, 
			'value': t
		}; 
	}

tag_attribute_name "Attribute Name"
	= n:([^\t\n\f \/\>\"\'\=]+)
	{ return n.textNode(); }

tag_attribute_value_dblquote "Attribute Value (Double Quoted)"
	=	('"' v:[^"]* '"')
	{ return v.textNode(); }

tag_attribute_value_singlequote "Attribute Value (Single Quoted)"
	=	("'" v:[^']* "'")
	{ return v.textNode(); }

tag_attribute_value_noquote "Attribute Value (Unquoted)"
	= v:[^\=\'\"\<\>` ]+
	{ return v.textNode(); }

tag_attribute_value "Attribute Value"
	= tag_attribute_value_dblquote
	/ tag_attribute_value_singlequote
	/ tag_attribute_value_noquote

attr_assignment "Attribute Assignment"
	= "=" _* i:tag_attribute_value?
	{
		if(!i) {
			return error("Found an attribute assignment \"=\" not followed by a value");
		}
		return i;
	}
text_node "Text Node"
	= tn:(char)+
	{ 
		return {
			'type': 'text',
			'content': tn.textNode()
		}; 
	}

char "Character"
	= [^<>]
_
	= [ \f\n\r\t\v]


