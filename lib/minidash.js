function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/; // Returns the element with the minimum value of the given function called on that element.
// Similar to lodash minBy function.

export var minBy = function minBy(list, func) {
  var min = null;
  var minElem = undefined;

  for (var _i2 = 0; _i2 < list.length; _i2++) {
    var elem = list[_i2];
    var val = func(elem);

    if (min === null || val < min) {
      min = val;
      minElem = elem;
    }
  }

  return minElem;
};
export var multiGroupBy = function multiGroupBy(array, groups) {
  var groupFuncs = groups.map(function (group) {
    return typeof group === 'string' ? function (obj) {
      return obj[group];
    } : group;
  });
  var result = {};

  for (var _i4 = 0; _i4 < array.length; _i4++) {
    var item = array[_i4];
    var workingObj = result;
    var numGroups = groupFuncs.length;

    for (var i = 0; i < numGroups; i++) {
      var groupFunc = groupFuncs[i];
      var key = groupFunc(item);

      if (workingObj[key] == null) {
        workingObj[key] = i === numGroups - 1 ? [] : {};
      }

      workingObj = workingObj[key];
    } // obj is an array now.


    workingObj.push(item);
  }

  return result;
};
export var groupBy = function groupBy(array, group) {
  return multiGroupBy(array, [group]);
};
export var keyBy = function keyBy(array, group) {
  var groupFunc = typeof group === 'string' ? function (obj) {
    return obj[group];
  } : group;
  var result = {};

  for (var _i6 = 0; _i6 < array.length; _i6++) {
    var item = array[_i6];
    var key = groupFunc(item);
    result[key] = item;
  }

  return result;
};
export var filter = function filter(list, predicate) {
  var result = [];

  for (var _i8 = 0; _i8 < list.length; _i8++) {
    var item = list[_i8];

    if (predicate(item)) {
      result.push(item);
    }
  }

  return result;
};

var _flatten2 = function _flatten2(obj, array) {
  for (var _i10 = 0; _i10 < array.length; _i10++) {
    var item = array[_i10];

    if (Array.isArray(item) || item instanceof HTMLCollection) {
      _flatten2(obj, item);
    } else {
      obj.push(item);
    }
  }
};

export var flatten = function flatten(array) {
  var result = [];

  _flatten2(result, array);

  return result;
};
/*
export const flattenDepth1 = array =>
	array.reduce((acc, val) => acc.concat(val), []);
*/

export var flattenDepth1 = function flattenDepth1(list) {
  var result = [];

  for (var _i12 = 0; _i12 < list.length; _i12++) {
    var item = list[_i12];

    if (Array.isArray(item) || item instanceof HTMLCollection) {
      for (var _i14 = 0; _i14 < item.length; _i14++) {
        var item2 = item[_i14];
        result.push(item2);
      }
    } else {
      result.push(item);
    }
  }

  return result;
};
export var isEmpty = function isEmpty(obj) {
  return _typeof(obj) === 'object' && Object.keys(obj).length === 0 || typeof obj === 'string' && obj.length === 0;
};

var makeObj = function makeObj(array) {
  var result = {};

  for (var _i16 = 0; _i16 < array.length; _i16++) {
    var item = array[_i16];
    result[item] = true;
  }

  return result;
};

export var uniq = function uniq(list) {
  var set = {};
  var result = [];

  for (var _i18 = 0; _i18 < list.length; _i18++) {
    var item = list[_i18];

    if (!(item in set)) {
      result.push(item);
      set[item] = true;
    }
  }

  return result;
};
export var uniqBy = function uniqBy(list, iteratee) {
  var set = {};
  var result = [];
  var predicate = typeof iteratee === 'string' ? function (obj) {
    return obj[iteratee];
  } : iteratee;

  for (var _i20 = 0; _i20 < list.length; _i20++) {
    var item = list[_i20];
    var val = predicate(item);

    if (!(val in set)) {
      result.push(item);
      set[val] = true;
    }
  }

  return result;
}; // Return all items in list1 that are NOT in list2.

export var difference = function difference(list1, list2) {
  var set = makeObj(list2);
  return filter(list1, function (item) {
    return !(item in set);
  });
};
export var sortBy = function sortBy(list, func) {
  for (var _len = arguments.length, moreFuncs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    moreFuncs[_key - 2] = arguments[_key];
  }

  var objsToSort = list.map(function (item) {
    return {
      value: item,
      result: func(item)
    };
  });
  objsToSort.sort(function (a, b) {
    if (a.result < b.result) return -1;
    if (a.result > b.result) return 1;

    for (var _i22 = 0; _i22 < moreFuncs.length; _i22++) {
      var f = moreFuncs[_i22];
      var fa = f(a.value);
      var fb = f(b.value);
      if (fa < fb) return -1;
      if (fa > fb) return 1;
    }

    return 0;
  });
  return objsToSort.map(function (obj) {
    return obj.value;
  });
}; // Object.values doesn't work in Tizen web widget or Tizen 3.0 web app.

export var objectValues = function objectValues(obj) {
  var result = [];

  for (var _i24 = 0, _Object$keys2 = Object.keys(obj); _i24 < _Object$keys2.length; _i24++) {
    var key = _Object$keys2[_i24];
    result.push(obj[key]);
  }

  return result;
};
export var contains = function contains(arr, pItem) {
  for (var _i26 = 0; _i26 < arr.length; _i26++) {
    var item = arr[_i26];

    if (item === pItem) {
      return true;
    }
  }

  return false;
};
export var equals = function equals(obj1, obj2) {
  for (var p in obj1) {
    if (obj2 == null || !(p in obj2)) {
      return false;
    }

    switch (_typeof(obj1[p])) {
      case 'object':
        if (!equals(obj1[p], obj2[p])) {
          return false;
        }

        break;

      case 'function':
        if (typeof obj2[p] !== 'function' || obj1[p].toString() != obj2[p].toString()) {
          return false;
        }

        break;

      default:
        if (obj1[p] !== obj2[p]) {
          return false;
        }

    }
  }

  for (var _p in obj2) {
    if (obj1 == null || !(_p in obj1)) {
      return false;
    }
  }

  return true;
};
export var isObject = function isObject(val) {
  return val !== null && (_typeof(val) === 'object' || typeof val === 'function');
};
export var get = function get(obj, path, defaultValue) {
  if (obj == null) return defaultValue;
  if (path == null) return obj;

  if (!Array.isArray(path)) {
    path = path.split('.');

    for (var i = path.length - 1; i >= 0; i--) {
      for (;;) {
        var elem = path[i];
        var match = reSubprops.exec(elem);
        if (match == null) break;

        if (match[1] === '') {
          path.splice(i, 1, match[3]);
          break;
        } else {
          path.splice(i, 1, match[1], match[3]);
        }
      }
    }
  }

  var currObj = obj;

  for (var _i28 = 0, _path2 = path; _i28 < _path2.length; _i28++) {
    var _elem = _path2[_i28];
    if (currObj == null) return defaultValue;
    if (_typeof(currObj) !== 'object' && typeof currObj !== 'function') throw new Error('get(): Cannot get property of non-object.');
    if (_elem == null) throw new Error('get(): Path element is null or undefined.');
    if (!(_elem in currObj)) return defaultValue;
    currObj = currObj[_elem];
  }

  return currObj;
};