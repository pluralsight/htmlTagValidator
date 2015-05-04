module.exports = {
  'script': {
    'additional': ['global'],
    'required': [],
    'normal': ['charset', 'src', 'type'],
    'void': ['async', 'defer'],
    'rules': function scriptRules(attributes, contents) {
      if (attributes['src'] != null && contents != null) {
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
      if (contents == null) {
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
