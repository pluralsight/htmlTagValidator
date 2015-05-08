// Utility Functions
var slice = [].slice;

function safe(obj) {
  // If it is not a string or array, is it not safe
  return ((isArray(obj) || isString(obj)) ? obj : []);
}

function str(obj) {
  return Object.prototype.toString.call(obj);
}

function isPlain(obj) {
  return str(obj) === "[object Object]";
}

function isPattern(obj) {
  return str(obj) === "[object RegExp]";
}

function isFunc(obj) {
  return str(obj) === "[object Function]";
}

function isString(obj) {
  return str(obj) === "[object String]";
}

function isArray(obj) {
  if (Array.isArray) {
    return Array.isArray(obj);
  }
  return str(obj) === "[object Array]";
}

function isOkay(obj) {
  return obj != null;
}

function has(thing, item) {
  var k, v, len;
  if (isArray(thing)) {
    if (isString(item)) {
      // thing is an array, find substring item
      return thing.indexOf(item) !== -1;
    } else {
      // thing is an array, find item in array
      return findWhere(thing, item) !== undefined;
    }
  } else if (isPlain(thing)) {
    // thing is an object
    if (isPlain(item)) {
      // item is an object, find each prop key and value in item within thing
      for (k in item) {
        v = item[k];
        if (!(thing.hasOwnProperty(k) && thing[k] === v)) {
          return false;
        }
      }
      return true;
    } else if (isArray(item)) {
      // item is an array, find each string prop within thing
      for (i = 0, len = item.length; i < len; i++) {
        k = item[i];
        if (!thing.hasOwnProperty(k)) {
          return false;
        }
      }
      return true;
    } else {
      // thing is an object, item is a string, find item string in thing
      return thing.hasOwnProperty(item);
    }
  }
  return false;
}

function stack(arr) {
  return (isArray(arr) ?
    arr.map(function (elem) {
      return elem[1];
    }) : []);
}

function collapse(arr) {
  if (isArray(arr) && arr.length) {
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

function mergeOptions(base, user) {
  var k, v, k2, v2;
  for (k in user) {
    v = user[k];
    if (k === '_') {
      // special magic to apply _ to all things at current level
      for (k2 in base) {
        v2 = base[k2];
        base[k2] = mergeOptions(v2, v);
      }
    } else if (isPlain(v)) {
      if (!has(base, k)) {
        base[k] = {};
      }
      base[k] = mergeOptions(base[k], v);
    } else {
      if (!has(base, k)) {
        base[k] = [];
      }
      if (!isArray(base[k])) {
        base[k] = [base[k]];
      }
      if (isArray(v)) {
        base[k] = slice.call(base[k]).concat(slice.call(v));
      } else {
        base[k].push(v);
      }
    }
  }
  return base;
}

function desugar(base, root) {
  var k, v;
  for (k in base) {
    v = base[k];
    if (isPlain(v)) {
      base[k] = desugar(v, root);
    } else {
      if (!isArray(v)) {
        v = [v];
      }
      base[k] = v.map(function (elem) {
        var path;
        if (isString(elem)) {
          // Try to resolve as a location
          path = resolve(elem, root);
          if (path !== false) {
            return path;
          } else if (elem.indexOf('*') !== -1) {
            // Convert to regular expression
            return new RegExp(elem.replace(/[\-\[\]\(\)]/g, "\\$&"), 'i');
          }
        }
        return elem;
      }).reduceRight(function(a, b) {
          return a.concat(b);
      }, []);
    }
  }
  return base;
}

function resolve(path, root) {
  var base = root,
      paths = path.split('/'),
      i, len, chunk;
  if (!isPlain(base) || paths.length === 0) { return false; }
  for (i = 0, len = paths.length; i < len; i++) {
    chunk = paths[i];
    if (has(base, chunk)) {
      base = base[chunk];
    } else {
      return false;
    }
  }
  return base;
}

function initializeOptions(codx, opts) {
  if (!isPlain(opts)) { opts = {}; }
  var res = mergeOptions(codx, opts),
      desugared = desugar(res, res);
  return option._options = desugared;
}

function option(path, sequence, base) {
  var start = base != null ? base : option._options,
      resolved = resolve(path, start),
      i, len, chunk, found = false;
  if (sequence != null) {
    if (!isArray(sequence)) { sequence = [sequence]; }
    for (i = 0, len = sequence.length; i < len; i++) {
      if (has(resolved, sequence[i])) {
        resolved = resolve(sequence[i], resolved);
        found = true;
        break;
      }
    }
    if (!found) { return null; }
  }
  return resolved !== false ? resolved : null;
}

function customTest(name, test, args) {
  var tester;

  if (isPattern(test)) {
    tester = function () {
      return test.test(args[0]);
    };
  } else if (isFunc(test)) {
    tester = function () {
      return test.apply(null, args);
    };
  } else if (isArray(test)) {
    tester = function () {
      var i, len, chunk, res;
      for (i = 0, len = test.length; i < len; i++) {
        chunk = test[i];
        res = customTest(name, chunk, args)
        if (res === true) {
          return true;
        } else if (has(res, 'error')) {
          return res;
        }
      }
      return false;
    };
  } else if (isString(test)) {
    tester = function () {
      if (isPlain(args[0])) {
        args[0] = Object.keys(args[0]);
      }
      if (isArray(args[0])) {
        return find(args[0], function (a) {
          return tagify(a) === tagify(test);
        }) != null;
      }
      return args[0] === tagify(test);
    };
  } else {
    return {
      'error': "Invalid " + htmlify(name) + " overrides specified in options object"
    };
  }

  return tester();
}

function find(arr, predicate) {
  if (arr == null) {
    throw new TypeError('find() called on null or undefined');
  }
  if (!isFunc(predicate)) {
    throw new TypeError('find() predicate must be a function');
  }
  var list = Object(arr);
  var length = list.length >>> 0;
  var thisArg = arguments[2];
  var value;

  for (var i = 0; i < length; i++) {
    value = list[i];
    if (predicate.call(thisArg, value, i, list)) {
      return value;
    }
  }
  return undefined;
};

function countWhere(arr, props) {
  var count, i, len, val;
  count = 0;
  for (i = 0, len = arr.length; i < len; i++) {
    val = arr[i];
    if (has(val, props)) {
      count += 1;
    }
  }
  return count;
};

function findWhere(arr, props) {
  var i, len, val;
  for (i = 0, len = arr.length; i < len; i++) {
    val = arr[i];
    if (has(val, props)) {
      return val;
    }
  }
  return null;
};

function nodeToString(node) {
  var elem = safe(node);
  if (isArray(elem)) {
    if (elem.length && isArray(elem[0])) {
      elem = stack(elem);
    }
    elem = elem.join('');
  }
  return elem;
}

function textNode(elem) {
  /*
   * A text node has
   * - no leading or trailing whitespace
   * - no consecutive whitespace characters
   */
  return nodeToString(elem).replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

function scriptify(elem) {
  /*
   * A script node has
   * - no leading or trailing newlines from open and close tags being on
   * 	 different lines from the start and end of the script contents
   */
  var res = nodeToString(elem).replace(/^\n+|\n+$/g, '');
  // Make sure it isn't empty, but do not process as textNode (preserve formatting)
  return textNode(res) !== '' ? res : null;
}

function htmlify(elem) {
  /*
   * A htmlified string has
   * - html-safe '&' symbol as '&amp;'
   * - html-safe '< symbol as '&lt;'
   * - html-safe '>' symbol as '&gt;'
   */
  return nodeToString(elem)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function tagify(elem) {
  /*
   * A tagified string has
   * - no leading or trailing whitespace
   * - no consecutive whitespace characters
   * - case-insensitive (lowercase normalized)
   */
  return textNode(elem).toLowerCase();
}


module.exports = {
  // Array methods
  'stack': 								stack,
  'collapse': 						collapse,
  'find': 								find,
  'findWhere': 						findWhere,
  'countWhere': 					countWhere,
  // String methods
  'nodeToString':					nodeToString,
  'htmlify':							htmlify,
  'textNode':							textNode,
  'scriptify':						scriptify,
  'tagify':								tagify,
  // Type detection
  'str': 									str,
  'isPlain': 							isPlain,
  'isPattern': 						isPattern,
  'isFunc': 							isFunc,
  'isString': 						isString,
  'isArray': 							isArray,
  'isOkay':								isOkay,
  // Misc methods
  'safe': 								safe,
  'has': 									has,
  'mergeOptions': 				mergeOptions,
  'desugar': 							desugar,
  'resolve': 							resolve,
  'initializeOptions': 		initializeOptions,
  'option':	 							option,
  'customTest': 					customTest
};
