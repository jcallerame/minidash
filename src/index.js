/* global global */
// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
					typeof global == 'object' && global.global === global && global ||
					this ||
					{};
						
const reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/;

export const identity = x => x;
export const isNil = x => x == null;
export const isNumber = x => toString.call(x) === '[object Number]';
export const isString = x => toString.call(x) === '[object String]';
export const isFunction = x => toString.call(x) === '[object Function]';
export const isDate = x => toString.call(x) === '[object Date]';
export const isError = x => toString.call(x) === '[object Error]';
export const isNaN = x => isNumber(x) && root.isNaN(x);
export const isArray = Array.isArray;
export const map = Array.prototype.map.call.bind(Array.prototype.map);
export const reduce = Array.prototype.reduce.call.bind(Array.prototype.reduce);
export const filter = Array.prototype.filter.call.bind(Array.prototype.filter);
export const some = Array.prototype.some.call.bind(Array.prototype.some);
export const every = Array.prototype.every.call.bind(Array.prototype);
export const concat = Array.prototype.concat.call.bind(Array.prototype.concat);
export const forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
export const indexOf = Array.prototype.indexOf.call.bind(Array.prototype.indexOf);
export const lastIndexOf = Array.prototype.lastIndexOf.call.bind(Array.prototype.lastIndexOf);
export const hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

const getIterateeFunc = iteratee => {
	return isString(iteratee) ? obj => obj[iteratee] : iteratee;
};

// Returns the element with the minimum value of the given iteratee for that element.
// Similar to lodash minBy function.
export const minBy = (list, iteratee) => {
	const func = getIterateeFunc(iteratee);
	let min = null;
	let minElem = undefined;
	for (const elem of list) {
		const val = func(elem);
		if (min === null || val < min) {
			min = val;
			minElem = elem;
		}
	}
	return minElem;
};

export const maxBy = (list, iteratee) => {
	const func = getIterateeFunc(iteratee);
	let max = null;
	let maxElem = undefined;
	for (const elem of list) {
		const val = func(elem);
		if (max === null || val > max) {
			max = val;
			maxElem = elem;
		}
	}
	return maxElem;
};

export const multiGroupBy = (array, groups) => {
	const groupFuncs = groups.map(group =>
		getIterateeFunc(group)
	);
	let result = {};
	for (const item of array) {
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
		// obj is an array now.
		workingObj.push(item);
	}
	return result;
};

export const groupBy = (array, group) => multiGroupBy(array, [group]);

export const keyBy = (array, iteratee) => {
	const func = getIterateeFunc(iteratee);
	let result = {};
	for (const item of array) {
		let key = func(item);
		result[key] = item;
	}
	return result;
};

export const countBy = (array, iteratee) => {
	const func = getIterateeFunc(iteratee);
	let result = {};
	for (const item of array) {
		let key = func(item);
		const oldCount = result[key];
		result[key] = (oldCount === undefined) ? 1 : oldCount + 1;
	}
	return result;
};

export const sum = array => {
	return reduce(array, (acc, val = 0) => acc + val);
};

export const sumBy = (array, iteratee) => {
	const func = getIterateeFunc(iteratee);
	return sum(map(array, func));
};

export const find = (array, predicate = identity, fromIndex = 0) => {
	for (let idx = fromIndex; idx < array.length; idx++) {
		const item = array[idx];
		if (predicate(item, idx, array)) {
			return item;
		}
	}
	return undefined;
};

export const findIndex = (array, predicate = identity, fromIndex = 0) => {
	for (let idx = fromIndex; idx < array.length; idx++) {
		const item = array[idx];
		if (predicate(item, idx, array)) {
			return idx;
		}
	}
	return undefined;
};

export const findLast = (array, predicate = identity, fromIndex = array.length - 1) => {
	for (let idx = fromIndex; idx > 0; idx--) {
		const item = array[idx];
		if (predicate(item, idx, array)) {
			return item;
		}
	}
	return undefined;
};

export const findLastIndex = (array, predicate = identity, fromIndex = array.length - 1) => {
	for (let idx = fromIndex; idx > 0; idx--) {
		const item = array[idx];
		if (predicate(item, idx, array)) {
			return idx;
		}
	}
	return undefined;
};


const _flatten2 = (obj, array) => {
	for (const item of array) {
		if (isArray(item) || 
				item instanceof HTMLCollection || 
				item instanceof NodeList) {
			_flatten2(obj, item);
		} else {
			obj.push(item);
		}
	}
};

export const flatten = array => {
	let result = [];
	_flatten2(result, array);
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
		(typeof obj === 'object' && Object.keys(obj).length === 0) ||
		(typeof obj === 'string' && obj.length === 0)
	);
};

const makeObj = array => {
	const result = {};
	for (const item of array) {
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

// Return all items in list1 that are NOT in list2.
export const difference = (list1, list2) => {
	const set = makeObj(list2);
	return filter(list1, item => !(set[item]));
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

export const without = (array, ...values) => {
	const set = makeObj(values);
	return filter(array, item => !(set[item]));
};

// Remove (and return) elements from array for which predicate returns
// a truthy value.
export const remove = (array, predicate = identity) => {
	const result = [];
	for (let i = array.length - 1; i >= 0; i--) {
		if (predicate(array[i])) {
			result.unshift(array.splice(i, 1));
		}
	}
	return result;
};

export const chunk = (array, size = 1) => {
	if (size < 1) {
		throw new Error('chunk(): size argument must be at least 1.');
	}
	const result = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
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

export const reverse = array => {
	let result = [];
	for (let i = array.length - 1; i >= 0; i--) {
		result.push(array[i]);
	}
	return result;
};

// Object.values doesn't work in Tizen web widget or Tizen 3.0 web app.
export const objectValues = obj => Object.keys(obj).map(key => obj[key]);

export const contains = (arr, pItem) => some(arr, item => item === pItem);

export const equals = (obj1, obj2) => {
	for (const p in obj1) {
		if (obj2 == null || !(p in obj2)) {
			return false;
		}
		switch (typeof obj1[p]) {
			case 'object':
				if (!equals(obj1[p], obj2[p])) {
					return false;
				}
				break;
			case 'function':
				if (
					typeof obj2[p] !== 'function' ||
					obj1[p].toString() != obj2[p].toString()
				) {
					return false;
				}
				break;
			default:
				if (obj1[p] !== obj2[p]) {
					return false;
				}
		}
	}
	for (const p in obj2) {
		if (obj1 == null || !(p in obj1)) {
			return false;
		}
	}
	return true;
};

export const isObject = val => {
	return val !== null && (typeof val === 'object' || typeof val === 'function');
};

export const get = (obj, path, defaultValue) => {
	if (obj == null) return defaultValue;
	if (path == null) return obj;
	if (!isArray(path)) {
		path = path.split('.');
		for (let i = path.length - 1; i >= 0; i--) {
			for (;;) {
				const elem = path[i];
				const match = reSubprops.exec(elem);
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
	let currObj = obj;
	for (const elem of path) {
		if (currObj == null) return defaultValue;
		if (typeof currObj !== 'object' && typeof currObj !== 'function')
			throw new Error('get(): Cannot get property of non-object.');
		if (elem == null)
			throw new Error('get(): Path element is null or undefined.');
		if (!(elem in currObj)) return defaultValue;
		currObj = currObj[elem];
	}
	return currObj;
};

// Return a new string which is the given string with the first letter capitalized.
// This function leaves the original string unchanged.
export const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);
