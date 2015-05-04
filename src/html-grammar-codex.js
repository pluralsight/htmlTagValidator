module.exports = {
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
  'tag-specific': {
    'html': ['manifest'],
    'base': ['href', 'target'],
    'link': ['href', 'rel', 'media', 'hreflang', 'type', 'sizes'],
    'meta': ['name', 'http-equiv', 'content', 'charset'],
    'style': ['media', 'type', 'scoped'],
    'script': ['src', 'async', 'defer', 'type', 'charset'],
    'body': [
      'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onblur',
      'onerror', 'onfocus', 'onhashchange', 'onload', 'onmessage',
      'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate',
      'onresize', 'onscroll', 'onstorage', 'onunload'
      ],
    'blockquote': ['cite'],
    'ol': ['reversed', 'start'],
    'li': ['value'],
    'a': [
      'href', 'target', 'ping', 'rel', 'media', 'hreflang', 'type'
    ],
    'q': ['cite'],
    'data': ['value'],
    'time': ['datetime', 'pubdate'],
    'ins': ['cite', 'datetime'],
    'del': ['cite', 'datetime'],
    'img': [
      'alt', 'src', 'srcset', 'crossorigin', 'usemap', 'ismap', 'width',
      'height'
      ],
    'iframe': [
      'src', 'srcdoc', 'name', 'sandbox', 'seamless', 'width', 'height'
    ],
    'embed': ['src', 'type', 'width', 'height'],
    'object': [
      'data', 'type', 'typemustmatch', 'name', 'usemap', 'form', 'width',
      'height'
      ],
    'param': ['name', 'value'],
    'video': [
      'src', 'crossorigin', 'poster', 'preload', 'autoplay', 'mediagroup',
      'loop', 'muted', 'controls', 'width', 'height'
    ],
    'audio': [
      'src', 'crossorigin', 'preload', 'autoplay', 'mediagroup', 'loop',
      'muted', 'controls'
    ],
    'source': ['src', 'type', 'media'],
    'track': ['default', 'kind', 'label', 'src', 'srclang'],
    'canvas': ['width', 'height'],
    'map': ['name'],
    'area': [
      'alt', 'coords', 'shape', 'href', 'target', 'ping', 'rel', 'media',
      'hreflang', 'type'
    ],
    'colgroup': ['span'],
    'col': ['span'],
    'td': ['colspan', 'rowspan', 'headers'],
    'th': ['colspan', 'rowspan', 'headers', 'scope', 'abbr'],
    'form': [
      'accept-charset', 'action', 'autocomplete', 'enctype', 'method',
      'name', 'novalidate', 'target'
    ],
    'fieldset': ['disabled', 'form', 'name'],
    'label': ['form', 'for'],
    'input': [
      'accept', 'alt', 'autocomplete', 'autofocus', 'checked', 'dirname',
      'disabled', 'form', 'formaction', 'formenctype', 'formmethod',
      'formnovalidate', 'formtarget', 'height', 'inputmode', 'list',
      'max', 'maxlength', 'min', 'multiple', 'name', 'pattern',
      'placeholder', 'readonly', 'required', 'size', 'src', 'step',
      'type', 'value', 'width'
    ],
    'button': [
      'autofocus', 'disabled', 'form', 'formaction', 'formenctype',
      'formmethod', 'formnovalidate', 'formtarget', 'name', 'type',
      'value'
    ],
    'select': [
      'autofocus', 'disabled', 'form', 'multiple', 'name', 'required',
      'size'
    ],
    'datalist': ['option'],
    'optgroup': ['disabled', 'label'],
    'option': ['disabled', 'label', 'selected', 'value'],
    'textarea': [
      'autocomplete', 'autofocus', 'cols', 'dirname', 'disabled', 'form',
      'inputmode', 'maxlength', 'name', 'placeholder', 'readonly',
      'required', 'rows', 'wrap'
    ],
    'keygen': [
      'autofocus', 'challenge', 'disabled', 'form', 'keytype', 'name'],
    'output': ['for', 'form', 'name'],
    'progress': ['value', 'max'],
    'meter': ['value', 'min', 'max', 'low', 'high', 'optimum'],
    'details': ['open'],
    'command': [
      'type', 'label', 'icon', 'disabled', 'checked', 'radiogroup',
      'command'
    ],
    'menu': ['type', 'label'],
    'dialog': ['open']
  },
  // Tag types
  'self-closing': [
    'area','base','br','col','command','embed','hr',
    'img', 'input','keygen','link','meta','param',
    'source','track', 'wbr'
  ]
};
