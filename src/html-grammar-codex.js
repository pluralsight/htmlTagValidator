/**
 * Tag and attribute names
 * @note Source: {@link http://www.w3schools.com/TAGS/ HTML Element Reference}
 * @note Source: {@link https://simon.html5.org/html-elements HTML Elements and Attributes}
 */
var codex = {
  'attributes': {
    '$': {
      'global': [
        'accesskey', 'class', 'contenteditable', 'contextmenu', 'data-*', 'dir',
        'draggable', 'dropzone', 'hidden', 'id', 'inert', 'itemid', 'itemprop',
        'itemref', 'itemscope', 'itemtype', 'lang', 'role', 'spellcheck', 'style',
        'tabindex', 'title', 'translate'
      ],
      'event': [
        'onabort', 'onblur', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick',
        'oncontextmenu', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter',
        'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange',
        'onemptied', 'onended', 'onerror', 'onfocus', 'onformchange', 'onforminput',
        'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload',
        'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown',
        'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel',
        'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset',
        'onreadystatechange', 'onseeked', 'onseeking', 'onselect', 'onshow',
        'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'onvolumechange',
        'onwaiting'
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
    'input': {
      'mixed': [
        'attributes/$/global', 'attributes/$/event'
      ],
      'normal': [
        'accept', 'alt', 'autocomplete', 'autofocus', 'checked', 'dirname',
        'disabled', 'form', 'formaction', 'formenctype', 'formmethod',
        'formnovalidate', 'formtarget', 'height', 'inputmode', 'list', 'max',
        'maxlength', 'min', 'multiple', 'name', 'pattern', 'placeholder',
        'readonly', 'required', 'size', 'src', 'step', 'type', 'value', 'width'
      ],
      'type-specific': {
        'file': {
          'normal': [
            'accept', 'multiple', 'required'
          ]
        },
        'image': {
          'normal': [
            'alt', 'formaction', 'formenctype', 'formmethod', 'formnovalidate',
            'formtarget', 'height', 'src', 'width'
          ]
        },
        'text': {
          'normal': [
            'autocomplete', 'dirname', 'inputmode', 'list', 'maxlength',
            'minlength', 'pattern', 'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'search': {
          'normal': [
            'autocomplete', 'dirname', 'inputmode', 'list', 'maxlength', 'minlength',
            'pattern', 'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'url': {
          'normal': [
            'autocomplete', 'list', 'maxlength', 'minlength', 'pattern',
            'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'tel': {
          'normal': [
            'autocomplete', 'list', 'maxlength', 'minlength', 'pattern',
            'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'email': {
          'normal': [
            'autocomplete', 'list', 'maxlength', 'minlength', 'multiple',
            'pattern', 'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'password': {
          'normal': [
            'autocomplete', 'inputmode', 'maxlength', 'minlength', 'pattern',
            'placeholder', 'readonly', 'required', 'size'
          ]
        },
        'datetime': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'date': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'month': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'week': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'time': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'datetime-local': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'readonly', 'required', 'step'
          ]
        },
        'number': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'placeholder', 'readonly',
            'required', 'step'
          ]
        },
        'range': {
          'normal': [
            'autocomplete', 'list', 'max', 'min', 'multiple', 'step'
          ]
        },
        'color': {
          'normal': [
            'autocomplete', 'list'
          ]
        },
        'checkbox': {
          'normal': [
            'checked', 'required'
          ]
        },
        'radio': {
          'normal': [
            'checked', 'required'
          ]
        },
        'submit': {
          'normal': [
            'formaction', 'formenctype', 'formmethod', 'formnovalidate',
            'formtarget'
          ]
        }
      },
      'value-types': [
        'hidden', 'text', 'search', 'tel', 'url', 'email', 'password', 'datetime',
        'date', 'month', 'week', 'time', 'datetime-local', 'number', 'range',
        'color', 'checkbox', 'radio', 'file', 'submit', 'image', 'reset', 'button'
      ],
      // TODO: Create tests for each of these rules
      'rules': function inputRules(attributes, contents, util) {
        if (!util.has(attributes, 'type')) { return true; }
        var tagCodex = codex['attributes']['input'],
            allowedTypes = tagCodex['value-types'],
            specificTypes = tagCodex['type-specific'],
            specificTypesAttrs, allowedAttrs, attr;
        // Check attributes based on the type of <input> element
        if (!util.has(allowedTypes, attributes['type'])) {
          return {
            'error': 'An input tag does not allow the value ' + _u.htmlify(attributes['type']) +
                     ' for the type attribute'
          };
        }
        specificTypesAttrs = specificTypes[attributes['type']];
        allowedAttrs = specificTypesAttrs['normal'].concat(specificTypesAttrs['mixed']);
        for (attr in attributes) {
          if (attr === 'type') {
            continue;
          }
          if (!util.has(allowedAttrs, attr)) {
            return {
              'error': 'An input tag does not allow the ' + _u.htmlify(attr) +
                       ' attribute when it has ' + _u.htmlify(attributes['type']) +
                       ' for the type attribute'
            };
          }
        }
        return true;
      }
    },
    'script': {
      'mixed': ['attributes/$/global'],
      'normal': ['charset', 'src', 'type'],
      'rules': function scriptRules(attributes, contents, util) {
        if (attributes['src'] != null && contents != null) {
          // If the 'src' attribute is present, the <script> element must be empty.
          return {
            'error': 'A script tag with a src attribute cannot have contents between the start and end tags'
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
      'rules': function styleRules(attributes, contents, util) {
        if (contents == null) {
          return {
            'error': 'The title tag is required to have content between the start and end tags'
          };
        }
        return true;
      }
    },
    'meta': {
      'mixed': ['attributes/$/global'],
      'normal': ['charset', 'content', 'http-equiv', 'name', 'scheme'],
      'rules': function metaRules(attributes, contents, util) {
        if ((attributes['name'] != null || attributes['http-equiv'] != null) && attributes['content'] == null) {
          return {
            'error': 'The meta tag content attribute must be defined if the name or http-equiv attributes are defined'
          };
        } else if ((attributes['name'] == null && attributes['http-equiv'] == null) && attributes['content'] != null) {
          return {
            'error': 'The meta tag content attribute cannot be defined unless the name or http-equiv attributes are defined'
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

module.exports = codex;
