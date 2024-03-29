/* global global */

const objectType = 'object';
const functionType = 'function';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == objectType && self.self === self && self ||
					typeof global == objectType && global.global === global && global ||
					this ||
					{};
						
const reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/;
const reTypedArrayTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
const numberTag = '[object Number]';
const booleanTag = '[object Boolean]';
const stringTag = '[object String]';
const functionTag = '[object Function]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const symbolTag = '[object Symbol]';
const regExpTag = '[object RegExp]';
const arrayTag = '[object Array]';
const nilPathElemErrorStr = 'Path element is null or undefined.';

const getTag = x => toString.call(x);

export const identity = x => x;
export const isNil = x => x == null;
export const isNumber = x => getTag(x) === numberTag;
export const isBoolean = x => getTag(x) === booleanTag;
export const isString = x => getTag(x) === stringTag;
export const isFunction = x => getTag(x) === functionTag;
export const isDate = x => getTag(x) === dateTag;
export const isError = x => getTag(x) === errorTag;
export const isSymbol = x => getTag(x) === symbolTag;
export const isArray = Array.isArray;
export const isTypedArray = x => reTypedArrayTag.test(getTag(x));
export const reduce = Array.prototype.reduce.call.bind(Array.prototype.reduce);
export const reduceRight = Array.prototype.reduceRight.call.bind(Array.prototype.reduceRight);
export const filter = Array.prototype.filter.call.bind(Array.prototype.filter);
export const concat = Array.prototype.concat.call.bind(Array.prototype.concat);
export const forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
export const indexOf = Array.prototype.indexOf.call.bind(Array.prototype.indexOf);
export const lastIndexOf = Array.prototype.lastIndexOf.call.bind(Array.prototype.lastIndexOf);
export const slice = Array.prototype.slice.call.bind(Array.prototype.slice);
export const reverse = Array.prototype.reverse.call.bind(Array.prototype.reverse);
export const join = Array.prototype.join.call.bind(Array.prototype.join);
export const hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

const getIterateeFunc = iteratee => {
	return isString(iteratee) ? obj => obj[iteratee] : iteratee;
};

export const map = (list, iteratee = identity, thisArg) => {
	let func = getIterateeFunc(iteratee);
	return Array.prototype.map.call(list, func, thisArg);
};

export const some = (list, iteratee = identity, thisArg) => {
	let func = getIterateeFunc(iteratee);
	return Array.prototype.some.call(list, func, thisArg);
};

export const every = (list, iteratee = identity, thisArg) => {
	let func = getIterateeFunc(iteratee);
	return Array.prototype.every.call(list, func, thisArg);
};

// Returns the element with the minimum value of the given iteratee for that element.
// Similar to lodash minBy function.
export const minBy = (list, iteratee = identity) => {
	const func = getIterateeFunc(iteratee);
	let min = null;
	let minElem = undefined;
	for (const elem of list) {
		const val = +func(elem);
		if (!isNaN(val) && (min === null || val < min)) {
			min = +val;
			minElem = elem;
		}
	}
	return minElem;
};

export const min = list => isEmpty(list) ? Infinity : minBy(list, identity);

export const maxBy = (list, iteratee = identity) => {
	const func = getIterateeFunc(iteratee);
	let max = null;
	let maxElem = undefined;
	for (const elem of list) {
		const val = +func(elem);
		if (!isNaN(val) && (max === null || val > max)) {
			max = +val;
			maxElem = elem;
		}
	}
	return maxElem;
};

export const max = list => isEmpty(list) ? -Infinity : maxBy(list, identity);

export const multiGroupBy = (list, groups = [identity]) => {
	const groupFuncs = groups.map(group =>
		getIterateeFunc(group)
	);
	let result = {};
	for (const item of list) {
		let workingObj = result;
		const numGroups = groupFuncs.length;
		for (let i = 0; i < numGroups; i++) {
			const groupFunc = groupFuncs[i];
			let key = groupFunc(item);
			if (workingObj[key] == null) {
				workingObj[key] = i === numGroups - 1 ? [] : {};
			}
			workingObj = workingObj[key];
		}
		// workingObj is an list now.
		workingObj.push(item);
	}
	return result;
};

export const groupBy = (list, group = identity) => multiGroupBy(list, [group]);

export const keyBy = (list, iteratee) => {
	const func = getIterateeFunc(iteratee);
	let result = {};
	for (const item of list) {
		let key = func(item);
		result[key] = item;
	}
	return result;
};

export const countBy = (list, iteratee = identity) => {
	const func = getIterateeFunc(iteratee);
	let result = {};
	for (const item of list) {
		let key = func(item);
		const oldCount = result[key];
		result[key] = (oldCount === undefined) ? 1 : oldCount + 1;
	}
	return result;
};

export const sum = list => sumBy(list, identity);

export const sumBy = (list, iteratee = identity) => {
	const func = getIterateeFunc(iteratee);
	let result = 0;
	for (const item of list) {
		const itemResult = func(item);
		const numItemResult = +itemResult;
		result += numItemResult;
	}
	return result;
};

export const find = (list, predicate = identity, fromIndex = 0) => {
	for (let idx = fromIndex; idx < list.length; idx++) {
		const item = list[idx];
		if (predicate(item, idx, list)) {
			return item;
		}
	}
	return undefined;
};

export const findIndex = (list, predicate = identity, fromIndex = 0) => {
	for (let idx = fromIndex; idx < list.length; idx++) {
		const item = list[idx];
		if (predicate(item, idx, list)) {
			return idx;
		}
	}
	return undefined;
};

export const findLast = (list, predicate = identity, fromIndex = list.length - 1) => {
	for (let idx = fromIndex; idx > 0; idx--) {
		const item = list[idx];
		if (predicate(item, idx, list)) {
			return item;
		}
	}
	return undefined;
};

export const findLastIndex = (list, predicate = identity, fromIndex = list.length - 1) => {
	for (let idx = fromIndex; idx > 0; idx--) {
		const item = list[idx];
		if (predicate(item, idx, list)) {
			return idx;
		}
	}
	return undefined;
};

export const reject = (list, predicate = identity) => {
	return filter(list, negate(predicate));
};

export const forEachRight = (list, iteratee, thisArg) => {
	for (let idx = list.length - 1; idx > 0; idx--) {
		const item = list[idx];
		iteratee.call(thisArg, item, idx, list);
	}
};

const _flatten2 = (obj, list) => {
	for (const item of list) {
		if (isArray(item) || 
				item instanceof HTMLCollection || 
				item instanceof NodeList) {
			_flatten2(obj, item);
		} else {
			obj.push(item);
		}
	}
};

export const flatten = list => {
	let result = [];
	_flatten2(result, list);
	return result;
};

export const flattenDepth1 = list => {
	let result = [];
	for (const item of list) {
		if (isArray(item) || 
				item instanceof HTMLCollection ||
				item instanceof NodeList) {
			for (const item2 of item) {
				result.push(item2);
			}
		} else {
			result.push(item);
		}
	}
	return result;
};

export const isEmpty = obj => {
	return (
		obj == null ||
		(typeof obj === objectType && Object.keys(obj).length === 0) ||
		(typeof obj === 'string' && obj.length === 0)
	);
};

export const nth = (list, pos) => {
	return pos >= 0 ? list[pos] : list[list.length - pos];
};

export const first = list => list[0];

export const rest = list => slice(list, 1);

export const head = (list, n = 1) => slice(list, 0, n);

export const tail = (list, n = 1) => slice(list, -n);

export const last = list => list[list.length - 1];

const makeObj = list => {
	const result = {};
	for (const item of list) {
		result[item] = true;
	}
	return result;
};

export const uniq = list => {
	let set = {};
	let result = [];
	for (const item of list) {
		if (!(set[item])) {
			result.push(item);
			set[item] = true;
		}
	}
	return result;
};

export const uniqBy = (list, iteratee) => {
	let set = {};
	let result = [];
	const func = getIterateeFunc(iteratee);
	for (const item of list) {
		const val = func(item);
		if (!(set[val])) {
			result.push(item);
			set[val] = true;
		}
	}
	return result;
};

// Like uniq, but optimized for and only works for sorted arrays
export const sortedUniq = list => {
	let lastElem;
	let result = [];
	for (let i = 0; i < list.length; i++) {
		const elem = list[i];
		if (i > 0) {
			if (elem !== lastElem) {
				result.push(elem);
				lastElem = elem;
			}
		} else {
			lastElem = elem;
		}
	}
	return result;
};

export const sortedUniqBy = (list, iteratee = identity) => {
	const func = getIterateeFunc(iteratee);
	let lastVal;
	let result = [];
	for (let i = 0; i < list.length; i++) {
		const elem = list[i];
		const val = func(elem);
		if (i > 0) {
			if (val !== lastVal) {
				result.push(elem);
				lastVal = val;
			}
		} else {
			lastVal = val;
		}
	}
	return result;
};

const getVals = (lists, func) => {
	let vals = {};
	for (const list of lists) {
		for (const item of list) {
			if (!(item in vals)) {
				vals[item] = func(item);
			}
		}
	}
	return vals;
};

// Return all items in list1 that are NOT in any of the otherLists.
export const difference = (...lists) => {
	return differenceBy(...lists, identity);
};

// differenceBy(list1, ...otherLists, [iteratee = identity])
// Like difference, but compares values by iteratee
export const differenceBy = (...args) => {
	const func = isArray(last(args)) ? identity : args.pop();
	const list1 = args.shift();
	const vals = getVals(args, func);
	const set = makeObj(values(vals));
	return filter(list1, item => !(set[func(item)]));
};

export const intersection = (list1, ...otherLists) => {
	let sets = [];
	for (const list of otherLists) {
		sets.push(makeObj(list));
	}
	return filter(uniq(list1), item => sets.every(set => set[item]));
};

export const intersectionBy = (...args) => {
	const iteratee = isArray(last(args)) ? identity : args.pop();
	let vals = getVals(args, iteratee);
	let sets = [];
	const list1 = args.shift();
	for (const list of args) {
		sets.push(makeObj(map(list, item => vals[item])));
	}
	return filter(uniqBy(list1, item => vals[item]), 
		item => sets.every(set => set[vals[item]]));
};

export const union = (...lists) => uniq(flattenDepth1(lists));

export const unionBy = (...args) => {
	const iteratee = isArray(last(args)) ? identity : args.pop();
	return uniqBy(flattenDepth1(args), iteratee);
};

export const pullAll = (array, values) => {
	const set = makeObj(values);
	for (let i = array.length - 1; i >= 0; i--) {
		if (set[array[i]]) {
			array.splice(i, 1);
		}
	}
};

export const pull = (array, ...values) => pullAll(array, values);

export const pullAt = (array, ...rest) => {
	const sortedIndexes = flattenDepth1(rest).sort();
	for (let i = sortedIndexes.length - 1; i >=0; i--) {
		array.splice(i, 1);
	}
};

export const without = (list, ...values) => {
	const set = makeObj(values);
	return filter(list, item => !(set[item]));
};

// Remove (and return) elements from array for which predicate returns
// a truthy value.
export const remove = (array, predicate = identity) => {
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			array.splice(i, 1);
		}
	}
	return array;
};

export const xorBy = (...args) => {
	const func = isArray(last(args)) ? identity : args.pop();
	const counts = countBy(flattenDepth1(args), func);
	return map(args, list => filter(list, elem => counts[elem] === 1));
};

export const xor = lists => xorBy(...lists, identity);

export const chunk = (list, size = 1) => {
	if (size < 1) {
		throw new Error('chunk(): size argument must be at least 1.');
	}
	const result = [];
	for (let i = 0; i < list.length; i += size) {
		result.push(list.slice(i, i + size));
	}
	return result;
};

export const sortBy = (list, func, ...moreFuncs) => {
	const objsToSort = map(list, item => ({ value: item, result: func(item) }));
	objsToSort.sort((a, b) => {
		if (a.result < b.result) return -1;
		if (a.result > b.result) return 1;
		for (const f of moreFuncs) {
			const fa = f(a.value);
			const fb = f(b.value);
			if (fa < fb) return -1;
			if (fa > fb) return 1;
		}
		return 0;
	});
	return objsToSort.map(obj => obj.value);
};

export const fill = (array, value, start = 0, end = array.length) => {
	let realStart = start >= 0 ? start : length + start;
	let realEnd = end >= 0 ? end : length + end;
	for (let i = realStart; i < realEnd; i++) {
		array[i] = value;
	}
};

export const values = obj => Object.keys(obj).map(key => obj[key]);

export const contains = (arr, pItem) => some(arr, item => item === pItem);

export const includes = (list, value, fromIndex = 0) => {
	const startPos = fromIndex >= 0 ? fromIndex : list.length + fromIndex;
	for (let i = startPos; i < list.length; i++) {
		if (list[i] === value) {
			return true;
		}
	}
	return false;
};

export const equals = (a, b) => {
	if (typeof val1 !== typeof val2) return false;
	if (typeof a !== objectType || typeof b !== objectType) {
		// return true if a === b or if both are NaN, false otherwise
		return a === a ? a === b : b !== b;
	}
	const aTag = getTag(a);
	const bTag = getTag(b);
	if (aTag !== bTag) {
		return false;
	}
	switch (aTag) {
		case numberTag:
			return +a === +b || (+a !== +a && +b !== +b); // true if a === b or both are NaN
		case booleanTag:
		case dateTag:
			return +a === +b;
		case stringTag:
		case regExpTag:
		case errorTag:
			return '' + a === '' + b;
		case symbolTag:
			return Symbol.prototype.valueOf.call(a) === Symbol.prototype.valueOf.call(b);
		case arrayTag:
			if (a.length !== b.length) return false;
	}
	for (const p in a) {
		if (!(p in b)) {
			return false;
		}
		if (!equals(a[p], b[p])) {
			return false;
		}
	}
	for (const p in b) {
		if (!(p in a)) {
			return false;
		}
	}
	return true;
};

export const isObject = val => {
	return val !== null && (typeof val === objectType || typeof val === 'function');
};

const getPathArray = path => {
	if (isArray(path))
		return path;
	let pathArray = path.split('.');
	for (let i = pathArray.length - 1; i >= 0; i--) {
		for (;;) {
			const elem = pathArray[i];
			const match = reSubprops.exec(elem);
			if (match == null) break;
			if (match[1] === '') {
				pathArray.splice(i, 1, match[3]);
				break;
			} else {
				pathArray.splice(i, 1, match[1], match[3]);
			}
		}
	}
	return pathArray;
};

export const get = (obj, path, defaultValue) => {
	if (obj == null) return defaultValue;
	if (path == null) return obj;
	const pathArray = getPathArray(path);
	let currObj = obj;
	for (const elem of pathArray) {
		if (currObj == null) return defaultValue;
		if (typeof currObj !== objectType && typeof currObj !== functionType)
			throw new Error('get(): Cannot get property of non-object.');
		if (elem == null)
			throw new Error('get(): ' + nilPathElemErrorStr);
		if (!(elem in currObj)) return defaultValue;
		currObj = currObj[elem];
	}
	return currObj;
};

export const hasIn = (obj, path) => {
	if (obj == null) return false;
	if (path == null) return true;
	const pathArray = getPathArray(path);
	let currObj = obj;
	for (const elem of pathArray) {
		if (!isObject(currObj))
			return false;
			if (elem == null)
				throw new Error('hasIn(): ' + nilPathElemErrorStr);
			if (!(elem in currObj)) return false;
			currObj = currObj[elem];
	}
	return currObj;
};

export const has = (obj, path) => {
	if (obj == null) return false;
	if (path == null) return true;
	const pathArray = getPathArray(path);
	let currObj = obj;
	for (const elem of pathArray) {
		if (!isObject(currObj))
			return false;
			if (elem == null)
				throw new Error('has(): ' + nilPathElemErrorStr);
			if (!hasOwnProperty(currObj, elem)) return false;
			currObj = currObj[elem];
	}
	return currObj;
};

export const invert = obj => {
	let result = {};
	for (const key of Object.keys(obj)) {
		const val = obj[key];
		result[val] = key;
	}
	return result;
};

export const clone = value => {
	if (!isObject(value))
		return value;
	const result = isArray(value) ? [] : {};
	for (const key of Object.keys(value)) {
		result[key] = value[key];
	}
	return result;
};

export const cloneDeep = value => {
	if (!isObject(value))
		return value;
	const result = isArray(value) ? [] : {};
	for (const key of Object.keys(value)) {
		result[key] = cloneDeep(value[key]);
	}
	return result;
};

export const setWith = (obj, path, value, customizer) => {
	const pathArray = getPathArray(path);
	let currObj = obj;
	for (const item of pathArray) {
		if (currObj[item] == null) {
			let newObj;
			if (customizer != null) {
				newObj = customizer(item);
			}
			if (newObj == null) {
				newObj = isNumber(item) ? new Array(item) : new Object();
			}
			currObj[item] = newObj;
		}
		currObj = currObj[item];
	}
	currObj[last(pathArray)] = value;
	return obj;
};

export const set = (obj, path, value) => setWith(obj, path, value);

export const pick = (obj, paths) => {
	let result = isArray(obj) ? [] : {};
	for (const path of paths) {
		const pathArray = getPathArray(path);
		set(result, pathArray, get(obj, pathArray));
	}
};

export const pickBy = (obj, predicate = identity) => {
	let result = isArray(obj) ? [] : {};
	for (const key of obj) {
		if (predicate(key, obj)) {
			result[key] = obj[key];
		}
	}
	return result;
};

export const omitBy = (obj, predicate = identity) => {
	let result = isArray(obj) ? [] : {};
	for (const key of obj) {
		if (!predicate(key, obj)) {
			result[key] = obj[key];
		}
	}
	return result;
};

const arePathArraysEqual = (pathA, pathB) => {
	if (pathA.length !== pathB.length) return false;
	for (let i = 0; i < pathA.length; i++) {
		if (pathA[i].toString() !== pathB[i].toString()) {
			return false;
		}
	}
	return true;
};

const _omit2 = (result, obj, currentPath, pathArraysToOmit) => {
	if (!isObject(obj)) {
		for (const pathArrayToOmit of pathArraysToOmit) {
			if (arePathArraysEqual(currentPath, pathArrayToOmit)) {
				return;
			}
		}
		set(result, currentPath, obj);
	} else {
		for (const key of Object.keys(obj)) {
			let newPath = [...currentPath, key];
			_omit2(result, obj[key], newPath, pathArraysToOmit);
		}
	}
};

export const omit = (obj, paths) => {
	let pathArrays = map(paths, getPathArray);
	const result = isArray(obj) ? [] : {};
	_omit2(result, obj, [], pathArrays);
	return result;
};

// Return a new string which is the given string with the first letter capitalized.
// This function leaves the original string unchanged.
export const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

export const isFinite = val => isNumber(val) && root.isFinite(val);

export const isInteger = val => {
	//use our isFinite function
	return isFinite(val) && Math.floor(val) === val;
};

export const isNaN = x => isNumber(x) && root.isNaN(x);

export const castArray = x => isArray(x) ? x : [x];

export const mean = list => sum(list) / list.length;

export const meanBy = (list, iteratee = identity) => {
	return sumBy(list, iteratee) / list.length;
};

// Returns the closest value to number that's within the inclusive
// lower and upper bounds.
export const clamp = (number, lower, upper = 0) => {
	if (lower > upper) {
		let tmp = lower;
		lower = upper;
		upper = tmp;
	}
	let result = number;
	if (result < lower) result = lower;
	else if (result > upper) result = upper;
	return result;
};

// Check if numer is between start and end.
// start = 0 if not supplied.
// Range is inclusive of start, but exclusive of end.
export const inRange = (number, start, end = 0) => {
	if (start > end) {
		let tmp = start;
		start = end;
		end = tmp;
	}
	return number >= start && number < end;
};

export const random = (...args) => {
	const lastArg = last(args);
	const floating = isBoolean(lastArg) ? lastArg : true;
	const upper = (args[1] === undefined) ? 1 : args[1];
	const lower = (args[0] === undefined) ? 0 : args[0];
	const rand = Math.random();
	const scaled = rand * (upper - lower);
	const shifted = scaled + lower;
	return floating ? shifted : Math.floor(shifted);
};

export const negate = predicate => 
	(...args) => !predicate.apply(this, args);

export const once = func => {
	let called = false;
	let result;
	return (...args) => {
		if (!called) {
			called = true;
			result = func.apply(this, args);
		}
		return result;
	};
};

// This code taken from lodash with only minor changes applied.
export const debounce = (func, wait, options = {}) => {
  let lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0;

  if (!isFunction(func)) {
    throw new TypeError('First argument to debounce must be a function.');
  }
  wait = +wait || 0;
	let leading = !!options.leading;
	let maxing = 'maxWait' in options;
	if (maxing) {
		maxWait = Math.max(+options.maxWait || 0, wait);
	}
	let trailing = 'trailing' in options ? !!options.trailing : true;

  function invokeFunc(time) {
    let args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    let timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    let now = Date.now();
    if (shouldInvoke(now)) {
      return trailingEdge(now);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(now));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced() {
    let now = Date.now(),
        isInvoking = shouldInvoke(now);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = now;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
};

// This function taken from lodash with only minor changes applied.
export const throttle = (func, wait, options = {}) => {
  if (typeof func != 'function') {
    throw new TypeError('First argument to throttle must be a function.');
  }
	const leading = 'leading' in options ? !!options.leading : true;
  const trailing = 'trailing' in options ? !!options.trailing : true;
  return debounce(func, wait, {
		leading,
		trailing,
    maxWait: wait,
  });
};
