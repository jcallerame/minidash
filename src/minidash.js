const reSubprops = /^(.*?)\[(['"]?)(.*?)\2\]$/;

// Returns the element with the minimum value of the given function called on that element.
// Similar to lodash minBy function.
export const minBy = (list, func) => {
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

export const multiGroupBy = (array, groups) => {
	const groupFuncs = groups.map(group =>
		typeof group === 'string' ? obj => obj[group] : group
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

export const keyBy = (array, group) => {
	const groupFunc = typeof group === 'string' ? obj => obj[group] : group;
	let result = {};
	for (const item of array) {
		let key = groupFunc(item);
		result[key] = item;
	}
	return result;
};

export const filter = (list, predicate) => {
	let result = [];
	for (const item of list) {
		if (predicate(item)) {
			result.push(item);
		}
	}
	return result;
};

const _flatten2 = (obj, array) => {
	for (const item of array) {
		if (Array.isArray(item) || item instanceof HTMLCollection) {
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

/*
export const flattenDepth1 = array =>
	array.reduce((acc, val) => acc.concat(val), []);
*/

export const flattenDepth1 = list => {
	let result = [];
	for (const item of list) {
		if (Array.isArray(item) || item instanceof HTMLCollection) {
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

export const sortBy = (list, func, ...moreFuncs) => {
	const objsToSort = list.map(item => ({ value: item, result: func(item) }));
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
	if (!Array.isArray(path)) {
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
