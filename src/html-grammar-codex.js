var _u = require('./html-parser-util');
/**
 * Defaults for global settings, tag names, and attribute names
 * @param {Object} opts User options
 * @note Source: {@link http://www.w3schools.com/TAGS/ HTML Element Reference}
 * @note Source: {@link https://simon.html5.org/html-elements HTML Elements and Attributes}
 */
function codex(opts) {
  // TODO: Refactor the options to make this less verbose
  // TODO: Refactor so that rules function doesn't have to repeat checkAttributes tasks
  var defs = {
    'settings': {
      'format': 'plain',
      // TODO: create strict and non-strict tag modes
      'tags': 'strict',
      // TODO: create strict and non-strict attribute modes
      'attributes': 'strict',
      // TODO: create merge and replace tag schemes
      'policy': 'merge',
      'verbose': false
    },
    'attributes': {
      '$': {
        'boolean': ['hidden', 'inert', 'itemscope'],
        'global': [
          'accesskey', 'class', 'contenteditable', 'contextmenu', 'data-*', 'dir',
          'draggable', 'dropzone', 'id', 'itemid', 'itemprop',
          'itemref', 'itemtype', 'lang', 'role', 'spellcheck', 'style',
          'tabindex', 'title', 'translate', 'aria-label', 'aria-labelledby'
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
          'attributes/$/global',
          'attributes/$/boolean'
        ]
      },
      // Tags with specific validation rules for attributes
      'input': {
        // TODO: Implement conditional attribute -> attribute in checkAttributes()
        'conditional': [
          'accept', 'alt', 'autocomplete', 'dirname', 'form',
          'formaction', 'formenctype', 'formmethod',
          'formtarget', 'height', 'inputmode', 'list', 'max', 'maxlength', 'min',
          'pattern', 'placeholder', 'size',
          'src', 'step', 'width'
        ],
        'boolean': ['checked', 'formnovalidate', 'multiple', 'readonly', 'required'],
        'conditions': [
          function inputConditions(attributes, util, codx) {
            if (!util.has(attributes, 'type')) { return true; }
            var conditionalAttrs = util.option('attributes/input', 'conditional', codx),
                conditionalRules = util.option('attributes/input/types', attributes['type'], codx),
                attr, type, paired,
                esc = util.escape;
            for (attr in attributes) {
              if (util.has(conditionalAttrs, attr) && util.isOkay(conditionalRules)) {
                paired = false;
                for (type in conditionalRules) {
                  if (util.has(conditionalRules[type], attr)) {
                    paired = true;
                    break;
                  }
                }
                if (paired !== true) {
                  return {
                    'error': 'An ' + esc('input') + ' tag cannot have the ' + esc.attr(attr) +
                             ' attribute when its ' + esc.attr('type') +
                             ' is set to ' + esc.val(attributes['type']) + ''
                  };
                }
              }
            }
            return true;
          }
        ],
        'mixed': [
          'attributes/$/global', 'attributes/$/boolean','attributes/$/event'
        ],
        'normal': [
          'name', 'type', 'value'
        ],
        'type-values': [
          'hidden', 'text', 'search', 'tel', 'url', 'email', 'password', 'datetime',
          'date', 'month', 'week', 'time', 'datetime-local', 'number', 'range',
          'color', 'checkbox', 'radio', 'file', 'submit', 'image', 'reset', 'button'
        ],
        'types': {
          'file': {
            'boolean': ['multiple', 'required'],
            'normal': [
              'accept'
            ]
          },
          'image': {
            'boolean': ['formnovalidate'],
            'normal': [
              'alt', 'formaction', 'formenctype', 'formmethod',
              'formtarget', 'height', 'src', 'width'
            ]
          },
          'text': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'dirname', 'inputmode', 'list', 'maxlength',
              'minlength', 'pattern', 'placeholder', 'size'
            ]
          },
          'search': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'dirname', 'inputmode', 'list', 'maxlength', 'minlength',
              'pattern', 'placeholder', 'size'
            ]
          },
          'url': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'maxlength', 'minlength', 'pattern',
              'placeholder', 'size'
            ]
          },
          'tel': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'maxlength', 'minlength', 'pattern',
              'placeholder', 'size'
            ]
          },
          'email': {
            'boolean': ['multiple', 'readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'maxlength', 'minlength',
              'pattern', 'placeholder', 'size'
            ]
          },
          'password': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'inputmode', 'maxlength', 'minlength', 'pattern',
              'placeholder', 'size'
            ]
          },
          'datetime': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'date': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'month': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'week': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'time': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'datetime-local': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'number': {
            'boolean': ['readonly', 'required'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'placeholder', 'step'
            ]
          },
          'range': {
            'boolean': ['multiple'],
            'normal': [
              'autocomplete', 'list', 'max', 'min', 'step'
            ]
          },
          'color': {
            'normal': [
              'autocomplete', 'list'
            ]
          },
          'checkbox': {
            'boolean': ['checked', 'required'],
          },
          'radio': {
            'boolean': ['checked', 'required'],
          },
          'submit': {
            'boolean': ['formnovalidate'],
            'normal': [
              'formaction', 'formenctype', 'formmethod',
              'formtarget'
            ]
          }
        },
        'rules': function inputRules(attributes, contents, util, codx) {
            if (!util.has(attributes, 'type')) { return true; }
            var allowedTypes = util.option('attributes/input', 'type-values', codx),
                esc = util.escape;
            // Check attributes based on the type of <input> element
            if (!util.has(allowedTypes, attributes['type'])) {
              return {
                'error': 'An ' + esc('input') + ' tag does not allow the value ' + esc.val(attributes['type']) +
                         ' for the ' + esc.attr('type') + ' attribute'
              };
            }
            return true;
          }
        // TODO: Create tests for each of these rules
        // TODO: Refactor these types of tests to be able to interact with 'global' and 'event'
        //       attributes easier.
      },
      'script': {
        'mixed': ['attributes/$/global'],
        'normal': ['charset', 'src', 'type'],
        'rules': function scriptRules(attributes, contents, util, codx) {
          var esc = util.escape;
          if (util.has(attributes, 'src') && util.isOkay(contents)) {
            // If the 'src' attribute is present, the <script> element must be empty.
            return {
              'error': 'A ' + esc('script') + ' tag with a ' + esc.attr('src') +
                       ' attribute cannot have content between the start and end tags'
            };
          }
          return true;
        },
        'boolean': ['async', 'defer']
      },
      'style': {
        'mixed': ['attributes/$/global', 'attributes/$/boolean','attributes/$/event'],
        'normal': ['media', 'scoped', 'type']
      },
      'title': {
        'mixed': ['attributes/$/global'],
        'rules': function styleRules(attributes, contents, util, codx) {
          var esc = util.escape;
          if (!util.isOkay(contents)) {
            return {
              'error': 'The ' + esc('title') +
                       ' tag is required to have content between the start and end tags'
            };
          }
          return true;
        }
      },
      'meta': {
        'mixed': ['attributes/$/global'],
        'normal': ['charset', 'content', 'http-equiv', 'name', 'scheme'],
        'rules': function metaRules(attributes, contents, util, codx) {
          var esc = util.escape;
          if ((util.has(attributes, 'name') || util.has(attributes, 'http-equiv')) && !util.has(attributes, 'content')) {
            return {
              'error': 'The ' + esc('meta') + ' tag ' + esc.attr('content') +
                       ' attribute must be defined if the ' + esc.attr('name') +
                       ' or ' + esc.attr('http-equiv') + ' attributes are defined'
            };
          } else if ((!util.has(attributes, 'name') && !util.has(attributes, 'http-equiv')) && util.has(attributes, 'content')) {
            return {
              'error': 'The ' + esc('meta') + ' tag ' + esc.attr('content') +
                       ' attribute cannot be defined unless the ' + esc.attr('name') +
                       ' or ' + esc.attr('http-equiv') + ' attributes are defined'
            };
          }
          return true;
        }
      },
      'link': {
        'mixed': ['attributes/$/global', 'attributes/$/boolean','attributes/$/event'],
        'normal': ['rel', 'crossorigin', 'href', 'hreflang', 'media', 'sizes', 'type'],
        'required': ['rel']
      },
      'iframe': {
        'mixed': ['attributes/$/global', 'attributes/$/boolean','attributes/$/event'],
        'normal': ['height', 'name', 'sandbox', 'src', 'srcdoc', 'width'],
        'boolean': ['allowfullscreen', 'seamless']
      },
      'html': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'manifest'
        ]
      },
      'head': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'base': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'body': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap'],
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
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'nav': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'article': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'aside': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h1': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h2': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h3': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h4': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h5': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'h6': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'hgroup': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'header': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'footer': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'address': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'p': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'hr': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['noshade']
      },
      'pre': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'blockquote': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'cite'
        ]
      },
      'ol': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['compact', 'reversed'],
        'normal': [
          'start'
        ]
      },
      'ul': {
        'boolean': ['compact'],
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'li': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'value'
        ]
      },
      'dl': {
        'boolean': ['compact'],
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'dt': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap']
      },
      'dd': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap']
      },
      'figure': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'figcaption': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'div': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap']
      },
      'a': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'strong': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'small': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      's': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'cite': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'q': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'cite'
        ]
      },
      'dfn': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'abbr': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'data': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'value'
        ]
      },
      'time': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'var': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'samp': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'kbd': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'sub': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'sup': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'i': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'b': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'u': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'mark': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'ruby': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'rt': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'rp': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'bdi': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'bdo': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'span': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'br': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'wbr': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'ins': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['ismap'],
        'normal': [
          'alt',
          'src',
          'srcset',
          'crossorigin',
          'usemap',
          'width',
          'height'
        ]
      },
      'embed': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['typemustmatch'],
        'normal': [
          'data',
          'type',
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
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['muted'],
        'normal': [
          'src',
          'crossorigin',
          'poster',
          'preload',
          'autoplay',
          'mediagroup',
          'loop',
          'controls',
          'width',
          'height'
        ]
      },
      'audio': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['muted'],
        'normal': [
          'src',
          'crossorigin',
          'preload',
          'autoplay',
          'mediagroup',
          'loop',
          'controls'
        ]
      },
      'source': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['default'],
        'normal': [
          'kind',
          'label',
          'src',
          'srclang'
        ]
      },
      'canvas': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'name'
        ]
      },
      'area': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nohref'],
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['sortable']
      },
      'caption': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'colgroup': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'span'
        ]
      },
      'col': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'span'
        ]
      },
      'tbody': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'thead': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'tfoot': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'tr': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'td': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap'],
        'normal': [
          'colspan',
          'rowspan',
          'headers'
        ]
      },
      'th': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['nowrap'],
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['novalidate'],
        'normal': [
          'accept-charset',
          'action',
          'autocomplete',
          'enctype',
          'method',
          'name',
          'target'
        ]
      },
      'fieldset': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['disabled'],
        'normal': [
          'form',
          'name'
        ]
      },
      'legend': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'label': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['autofocus', 'disabled', 'formnovalidate'],
        'normal': [
          'form',
          'formaction',
          'formenctype',
          'formmethod',
          'formtarget',
          'name',
          'type',
          'value'
        ]
      },
      'select': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['autofocus', 'disabled', 'multiple', 'required'],
        'normal': [
          'form',
          'name',
          'size'
        ]
      },
      'datalist': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'normal': [
          'option'
        ]
      },
      'optgroup': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['disabled'],
        'normal': [
          'label'
        ]
      },
      'option': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['disabled', 'selected'],
        'normal': [
          'label',
          'value'
        ]
      },
      'textarea': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['autofocus', 'disabled', 'readonly', 'required'],
        'normal': [
          'autocomplete',
          'cols',
          'dirname',
          'form',
          'inputmode',
          'maxlength',
          'name',
          'placeholder',
          'rows',
          'wrap'
        ]
      },
      'keygen': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['autofocus', 'disabled'],
        'normal': [
          'challenge',
          'form',
          'keytype',
          'name'
        ]
      },
      'output': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
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
          'attributes/$/boolean',
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
          'attributes/$/boolean',
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
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': [
          'open'
        ]
      },
      'summary': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ]
      },
      'command': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['checked', 'disabled'],
        'normal': [
          'type',
          'label',
          'icon',
          'radiogroup',
          'command'
        ]
      },
      'menu': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': ['compact'],
        'normal': [
          'type',
          'label'
        ]
      },
      'dialog': {
        'mixed': [
          'attributes/$/global',
          'attributes/$/boolean',
          'attributes/$/event'
        ],
        'boolean': [
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
    },
    'namedReferences': require('./html-named-references')
  };
  var shouldMerge;
  if (!_u.isPlain(opts)) { opts = {}; }
  shouldMerge = (_u.has(opts, 'settings') && _u.has(opts['settings'], 'policy') ?
                  opts['settings']['policy'] :
                  defs['settings']['policy'])  === 'merge';
  // Merge defaults with user options, replace user settings
  [ {
      'type': 'tags',
      'policy': 'merge'
    }, {
      'type': 'attributes',
      'policy': 'merge'
    }, {
      'type': 'settings',
      'policy': 'replace'
    }
  ].forEach(function (m) {
    // Never merge settings
    var willMerge = (shouldMerge === true && m.policy !== 'replace'),
      res = _u.has(opts, m.type) ?
        _u.mergeOptions(defs[m.type], opts[m.type], willMerge) :
        defs[m.type];
    defs[m.type] = m.type !== 'settings' ? _u.desugar(res, res, m.type) : res;
  });
  return defs;
}

module.exports = codex;
