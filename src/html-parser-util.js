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

function has(thing, item) {
	var k, v, len;
	if (isArray(thing)) {
		if (isString(item)) {
			// thing is an array, find substring item
			return thing.indexOf(item) !== -1;
		} else {
			// thing is an array, find item in array
			return thing.findWhere(item) !== undefined;
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
				return args[0].find(function (a) {
					return safe(a).tagify() === test.tagify();
				}) != null;
			}
			return args[0] === test.tagify();
		};
	} else {
		return {
			'error': "Invalid " + name + " overrides specified in options object"
		};
	}

	return tester();
}

module.exports = {
	'safe': 								safe,
	'str': 									str,
	'isPlain': 							isPlain,
	'isPattern': 						isPattern,
	'isFunc': 							isFunc,
	'isString': 						isString,
	'isArray': 							isArray,
	'has': 									has,
	'stack': 								stack,
	'collapse': 						collapse,
	'mergeOptions': 				mergeOptions,
	'desugar': 							desugar,
	'resolve': 							resolve,
	'initializeOptions': 		initializeOptions,
	'option':	 							option,
	'customTest': 					customTest
};
