function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/; // Returns the element with the minimum value of the given function called on that element.
// Similar to lodash minBy function.

export var minBy = function minBy(list, func) {
  var min = null;
  var minElem = undefined;

  for (var _iterator = list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var elem = _ref;
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

  for (var _iterator2 = array, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var item = _ref2;
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

  for (var _iterator3 = array, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var item = _ref3;
    var key = groupFunc(item);
    result[key] = item;
  }

  return result;
};
export var filter = function filter(list, predicate) {
  var result = [];

  for (var _iterator4 = list, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    var item = _ref4;

    if (predicate(item)) {
      result.push(item);
    }
  }

  return result;
};

var _flatten2 = function _flatten2(obj, array) {
  for (var _iterator5 = array, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
    var _ref5;

    if (_isArray5) {
      if (_i5 >= _iterator5.length) break;
      _ref5 = _iterator5[_i5++];
    } else {
      _i5 = _iterator5.next();
      if (_i5.done) break;
      _ref5 = _i5.value;
    }

    var item = _ref5;

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

  for (var _iterator6 = list, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
    var _ref6;

    if (_isArray6) {
      if (_i6 >= _iterator6.length) break;
      _ref6 = _iterator6[_i6++];
    } else {
      _i6 = _iterator6.next();
      if (_i6.done) break;
      _ref6 = _i6.value;
    }

    var item = _ref6;

    if (Array.isArray(item) || item instanceof HTMLCollection) {
      for (var _iterator7 = item, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
        var _ref7;

        if (_isArray7) {
          if (_i7 >= _iterator7.length) break;
          _ref7 = _iterator7[_i7++];
        } else {
          _i7 = _iterator7.next();
          if (_i7.done) break;
          _ref7 = _i7.value;
        }

        var item2 = _ref7;
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

  for (var _iterator8 = array, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
    var _ref8;

    if (_isArray8) {
      if (_i8 >= _iterator8.length) break;
      _ref8 = _iterator8[_i8++];
    } else {
      _i8 = _iterator8.next();
      if (_i8.done) break;
      _ref8 = _i8.value;
    }

    var item = _ref8;
    result[item] = true;
  }

  return result;
};

export var uniq = function uniq(list) {
  var set = {};
  var result = [];

  for (var _iterator9 = list, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
    var _ref9;

    if (_isArray9) {
      if (_i9 >= _iterator9.length) break;
      _ref9 = _iterator9[_i9++];
    } else {
      _i9 = _iterator9.next();
      if (_i9.done) break;
      _ref9 = _i9.value;
    }

    var item = _ref9;

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

  for (var _iterator10 = list, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
    var _ref10;

    if (_isArray10) {
      if (_i10 >= _iterator10.length) break;
      _ref10 = _iterator10[_i10++];
    } else {
      _i10 = _iterator10.next();
      if (_i10.done) break;
      _ref10 = _i10.value;
    }

    var item = _ref10;
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

    for (var _i11 = 0, _moreFuncs = moreFuncs; _i11 < _moreFuncs.length; _i11++) {
      var f = _moreFuncs[_i11];
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

  for (var _i12 = 0, _Object$keys = Object.keys(obj); _i12 < _Object$keys.length; _i12++) {
    var key = _Object$keys[_i12];
    result.push(obj[key]);
  }

  return result;
};
export var contains = function contains(arr, pItem) {
  for (var _iterator11 = arr, _isArray11 = Array.isArray(_iterator11), _i13 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
    var _ref11;

    if (_isArray11) {
      if (_i13 >= _iterator11.length) break;
      _ref11 = _iterator11[_i13++];
    } else {
      _i13 = _iterator11.next();
      if (_i13.done) break;
      _ref11 = _i13.value;
    }

    var item = _ref11;

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

  for (var _iterator12 = path, _isArray12 = Array.isArray(_iterator12), _i14 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
    var _ref12;

    if (_isArray12) {
      if (_i14 >= _iterator12.length) break;
      _ref12 = _iterator12[_i14++];
    } else {
      _i14 = _iterator12.next();
      if (_i14.done) break;
      _ref12 = _i14.value;
    }

    var _elem = _ref12;
    if (currObj == null) return defaultValue;
    if (_typeof(currObj) !== 'object' && typeof currObj !== 'function') throw new Error('get(): Cannot get property of non-object.');
    if (_elem == null) throw new Error('get(): Path element is null or undefined.');
    if (!(_elem in currObj)) return defaultValue;
    currObj = currObj[_elem];
  }

  return currObj;
};