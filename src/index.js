const reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/;

export const identity = x => x;
export const isNil = x => x == null;
export const isNumber = x => toString.call(x) === '[object Number]';
export const isString = x => toString.call(x) === '[object String]';
export const isFunction = x => toString.call(x) === '[object Function]';
export const isDate = x => toString.call(x) === '[object Date]';
export const isError = x => toString.call(x) === '[object Error]';
export const isArray = Array.isArray;
export const map = Array.prototype.map.call.bind(Array.prototype.map);
export const reduce = Array.prototype.reduce.call.bind(Array.prototype.reduce);
export const filter = Array.prototype.filter.call.bind(Array.prototype.filter);
export const some = Array.prototype.some.call.bind(Array.prototype.some);
export const every = Array.prototype.every.call.bind(Array.prototype);
export const concat = Array.prototype.concat.call.bind(Array.prototype.concat);
export const forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

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

export const sum = array => {
	return array.reduce((acc, val = 0) => acc + val);
};

export const sumBy = (array, iteratee) => {
	const func = getIterateeFunc(iteratee);
	return array.reduce((acc, val) => {
		const result = func(val);
		return result === undefined ? acc : acc + result;
	});
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
		if (!(item in set)) {
			result.push(item);
			set[item] = true;
		}
	}
	return result;
};

export const uniqBy = (list, iteratee) => {
	let set = {};
	let result = [];
	const predicate =
		typeof iteratee === 'string' ? obj => obj[iteratee] : iteratee;
	for (const item of list) {
		const val = predicate(item);
		if (!(val in set)) {
			result.push(item);
			set[val] = true;
		}
	}
	return result;
};

// Return all items in list1 that are NOT in list2.
export const difference = (list1, list2) => {
	const set = makeObj(list2);
	return filter(list1, item => !(item in set));
};

export const pullAll = (array, values) => {
	const set = makeObj(values);
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] in set) {
			array.splice(i, 1);
		}
	}
};

export const pull = (array, ...values) => pullAll(array, values);

export const without = (array, ...values) => {
	const set = makeObj(values);
	const result = [];
	for (const item of array) {
		if (!(item in set)) {
			result.push(item);
		}
	}
	return result;
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
		result.push(array.slice(i, size));
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
export const objectValues = obj => {
	let result = [];
	for (const key of Object.keys(obj)) {
		result.push(obj[key]);
	}
	return result;
};

export const contains = (arr, pItem) => {
	for (const item of arr) {
		if (item === pItem) {
			return true;
		}
	}
	return false;
};

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
