/*
	TODO:
		Doctypes
		comments
		parse plain text element contents ("pre","code","textarea","script","style")
		Return AST instead of html, something like...:

		{
			type: 'HTMLELEMENT'
			selfClosing: true/false
			tagName: "body"
			attributes: {
				class: "main head asdas"
				id: "asdads"
			}
			children:[
				{
					type: 'text'
					content: "hello world"
				},
				{
					type: 'HTMLELEMENT'
					selfClosing: false,
					tagName: "strong",
					children: {
						{
							type: 'text'
							content: "I am bold"
						}
					}
				}
			]
		}
*/

{
	function stripws(s) {
		return s.replace(/^\s+/, "").replace(/\s+$/, "");
	}

	function isSelfClosing(tagName) {
		var selfClosingTags = ['area','base','br','col','command','embed','hr','img',
													 'input','keygen','link','meta','param','source','track','wbr'];
		return selfClosingTags.indexOf(tagName) !== -1;
	}
}

/* Start Grammar */
start
	= s:content { return s }

tag
 = normal_tag / self_closing_tag

normal_tag "HTML Tag"
	= otn:open_tag !{return isSelfClosing(otn)} c:content ctn:close_tag
	{
		if(otn !== ctn) {
			return error("Expected open tag: " + otn + " to match closing tag: " + ctn);
		}
		return  "<" + otn + ">" + c + "</" + ctn + ">"
	}

self_closing_tag "Self Closing Tag"
	= ot:open_tag
	{
		if(!isSelfClosing(ot)) {
			return error("<" + ot + ">" + " is not a valid self closing tag");
		}
		return "<" + ot + ">"
	}

open_tag "Opening Tag"
	= "<" t:tagname attr:(tag_attribute)* ">"
	{
		console.log(attr)
		return t
	}

close_tag "Closing Tag"
	= "</" t:tagname ">"
	{ return t }

tagname "Tag Name"
	= a:[A-Za-z] s:[0-9A-Z_a-z-]*
	{ return a+s.join("") }

content "Content"
	= s:(char/tag)*
	{ return s.join("") }

tag_attribute "Attribute"
  = _+ ta:tag_attribute_name t:(attr_assignment)
	{
		return [ta.join(""), t];
	}

tag_attribute_name
	= n:([^\t\n\f \/\>\"\'\=]+)
	{ return n }

tag_attribute_value_dblquote
	=	('"' v:[^"]* '"')
	{
		return v.join("")
	}

tag_attribute_value_singlequote
	=	("'" v:[^']* "'")
	{
		return v.join("")
	}

tag_attribute_value_noquote
	= v:[^\=\'\"\<\>` ]+
	{
		return v.join("")
	}

tag_attribute_value
	= tag_attribute_value_dblquote
	/ tag_attribute_value_singlequote
	/ tag_attribute_value_noquote

attr_assignment
	= "=" i:tag_attribute_value
	{
		return i
	}
char "Character"
	= [^<>]
_
	= [ \f\n\r\t\v]


