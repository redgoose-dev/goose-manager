/**
 * array to object
 * 배열에서 객체로 변환시켜주는 툴
 *
 * @param {Array} arr
 * @param {String} key
 * @param {Function} hook
 * @return {Object}
 */
export function arrayToObject(arr=[], key=null, hook=null)
{
	let result = {};
	arr.forEach((o, k) => {
		if (key)
		{
			let n = o[key] || 0;
			if (hook) o = hook(o);
			if (!(result[n] && result[n].children && Array.isArray(result[n].children)))
			{
				result[n] = { children: [] };
			}
			result[n].children.push(o);
		}
		else
		{
			if (hook) o = hook(o);
			result[k] = o;
		}
	});
	return result;
}

export function getObjectValueToArray(arr, key)
{
	let result = [];
	arr.forEach((o) => {
		if (o[key]) result.push(o[key]);
	});
	return result;
}