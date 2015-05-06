module.exports = {
  // Attribute types
  'attributes': {
    '$': {
      'global': [
        // Ignore attributes that are one of the following forms:
        // data-*, aria-*
        /(^(data|aria)\-)/i,
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
      ]
    },
    // TODO: Verify this is correct behavior
    // All tags not specifically mentioned should accept global and event attributes
    '_': {
      'mixed': [
        'attributes/$/global'
      ]
    },
    // Tags with specific validation rules for attributes
    'script': {
      'mixed': ['attributes/$/global'],
      'normal': ['charset', 'src', 'type'],
      'rules': function scriptRules(attributes, contents) {
        if (attributes['src'] != null && contents != null) {
          // If the 'src' attribute is present, the <script> element must be empty.
          return {
            'error': 'A <script> tag with a src attribute cannot have contents between the start and end tags'
          };
        }
        return true;
      },
      'void': ['async', 'defer']
    },
    'style': {
      'mixed': ['attributes/$/global', 'attributes/$/event'],
      'normal': ['media', 'scoped', 'type']
    },
    'title': {
      'mixed': ['attributes/$/global'],
      'rules': function styleRules(attributes, contents) {
        if (contents == null) {
          return {
            'error': 'The <title> tag is required to have content between the start and end tags'
          };
        }
        return true;
      }
    },
    'meta': {
      'mixed': ['attributes/$/global'],
      'normal': ['charset', 'content', 'http-equiv', 'name', 'scheme'],
      'rules': function metaRules(attributes, contents) {
        if ((attributes['name'] != null || attributes['http-equiv'] != null) && attributes['content'] == null) {
          return {
            'error': 'The <meta> tag content attribute must be defined if the name or http-equiv attributes are defined'
          };
        } else if ((attributes['name'] == null && attributes['http-equiv'] == null) && attributes['content'] != null) {
          return {
            'error': 'The <meta> tag content attribute cannot be defined unless the name or http-equiv attributes are defined'
          };
        }
        return true;
      }
    },
    'link': {
      'mixed': ['attributes/$/global', 'attributes/$/event'],
      'normal': ['rel', 'crossorigin', 'href', 'hreflang', 'media', 'sizes', 'type'],
      'required': ['rel']
    },
    'iframe': {
      'mixed': ['attributes/$/global', 'attributes/$/event'],
      'normal': ['height', 'name', 'sandbox', 'seamless', 'src', 'srcdoc', 'width']
    },
    'html': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'manifest'
      ]
    },
    'head': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'base': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'href',
        'target'
      ]
    },
    'noscript': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'body': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'onafterprint',
        'onbeforeprint',
        'onbeforeunload',
        'onblur',
        'onerror',
        'onfocus',
        'onhashchange',
        'onload',
        'onmessage',
        'onoffline',
        'ononline',
        'onpagehide',
        'onpageshow',
        'onpopstate',
        'onresize',
        'onscroll',
        'onstorage',
        'onunload'
      ]
    },
    'section': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'nav': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'article': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'aside': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h1': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h2': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h3': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h4': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h5': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'h6': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'hgroup': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'header': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'footer': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'address': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'p': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'hr': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'pre': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'blockquote': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'cite'
      ]
    },
    'ol': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'reversed',
        'start'
      ]
    },
    'ul': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'li': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'value'
      ]
    },
    'dl': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'dt': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'dd': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'figure': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'figcaption': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'div': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'a': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'href',
        'target',
        'ping',
        'rel',
        'media',
        'hreflang',
        'type'
      ]
    },
    'em': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'strong': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'small': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    's': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'cite': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'q': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'cite'
      ]
    },
    'dfn': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'abbr': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'data': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'value'
      ]
    },
    'time': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'datetime',
        'pubdate'
      ]
    },
    'code': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'var': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'samp': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'kbd': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'sub': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'sup': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'i': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'b': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'u': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'mark': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'ruby': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'rt': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'rp': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'bdi': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'bdo': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'span': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'br': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'wbr': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'ins': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'cite',
        'datetime'
      ]
    },
    'del': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'cite',
        'datetime'
      ]
    },
    'img': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'alt',
        'src',
        'srcset',
        'crossorigin',
        'usemap',
        'ismap',
        'width',
        'height'
      ]
    },
    'embed': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'src',
        'type',
        'width',
        'height'
      ]
    },
    'object': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'data',
        'type',
        'typemustmatch',
        'name',
        'usemap',
        'form',
        'width',
        'height'
      ]
    },
    'param': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'name',
        'value'
      ]
    },
    'video': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'src',
        'crossorigin',
        'poster',
        'preload',
        'autoplay',
        'mediagroup',
        'loop',
        'muted',
        'controls',
        'width',
        'height'
      ]
    },
    'audio': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'src',
        'crossorigin',
        'preload',
        'autoplay',
        'mediagroup',
        'loop',
        'muted',
        'controls'
      ]
    },
    'source': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'src',
        'type',
        'media'
      ]
    },
    'track': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'default',
        'kind',
        'label',
        'src',
        'srclang'
      ]
    },
    'canvas': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'width',
        'height'
      ]
    },
    'map': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'name'
      ]
    },
    'area': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'alt',
        'coords',
        'shape',
        'href',
        'target',
        'ping',
        'rel',
        'media',
        'hreflang',
        'type'
      ]
    },
    'table': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'caption': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'colgroup': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'span'
      ]
    },
    'col': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'span'
      ]
    },
    'tbody': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'thead': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'tfoot': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'tr': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'td': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'colspan',
        'rowspan',
        'headers'
      ]
    },
    'th': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'colspan',
        'rowspan',
        'headers',
        'scope',
        'abbr'
      ]
    },
    'form': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'accept-charset',
        'action',
        'autocomplete',
        'enctype',
        'method',
        'name',
        'novalidate',
        'target'
      ]
    },
    'fieldset': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'disabled',
        'form',
        'name'
      ]
    },
    'legend': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'label': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'form',
        'for'
      ]
    },
    // TODO: Updated based on type in 0.3.x
    'input': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'accept',
        'alt',
        'autocomplete',
        'autofocus',
        'checked',
        'dirname',
        'disabled',
        'form',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
        'height',
        'inputmode',
        'list',
        'max',
        'maxlength',
        'min',
        'multiple',
        'name',
        'pattern',
        'placeholder',
        'readonly',
        'required',
        'size',
        'src',
        'step',
        'type',
        'value',
        'width'
      ]
    },
    'button': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'autofocus',
        'disabled',
        'form',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
        'name',
        'type',
        'value'
      ]
    },
    'select': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'autofocus',
        'disabled',
        'form',
        'multiple',
        'name',
        'required',
        'size'
      ]
    },
    'datalist': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'option'
      ]
    },
    'optgroup': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'disabled',
        'label'
      ]
    },
    'option': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'disabled',
        'label',
        'selected',
        'value'
      ]
    },
    'textarea': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'autocomplete',
        'autofocus',
        'cols',
        'dirname',
        'disabled',
        'form',
        'inputmode',
        'maxlength',
        'name',
        'placeholder',
        'readonly',
        'required',
        'rows',
        'wrap'
      ]
    },
    'keygen': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'autofocus',
        'challenge',
        'disabled',
        'form',
        'keytype',
        'name'
      ]
    },
    'output': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'for',
        'form',
        'name'
      ]
    },
    'progress': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'value',
        'max'
      ]
    },
    'meter': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'value',
        'min',
        'max',
        'low',
        'high',
        'optimum'
      ]
    },
    'details': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'open'
      ]
    },
    'summary': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ]
    },
    'command': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'type',
        'label',
        'icon',
        'disabled',
        'checked',
        'radiogroup',
        'command'
      ]
    },
    'menu': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'type',
        'label'
      ]
    },
    'dialog': {
      'mixed': [
        'attributes/$/global',
        'attributes/$/event'
      ],
      'normal': [
        'open'
      ]
    }
  },
  // Tag types
  'tags': {
    'void': [
      'area','base','br','col','command','embed','hr',
      'img', 'input','keygen','link','meta','param',
      'source','track', 'wbr'
    ]
  }
};
