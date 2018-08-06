/**
 * get file size
 *
 * @param {Number} bytes
 * @return {String}
 */
export function getFileSize(bytes)
{
	const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
	if (bytes === 0) return '0 Byte';
	let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
}

/**
 * serialize
 * object to parameter
 *
 * @param {Object} obj
 * @param {Boolean} usePrefix
 * @return {String}
 */
export function serialize(obj, usePrefix=false)
{
	let str = [];
	let res = '';
	for (let p in obj)
	{
		if (obj.hasOwnProperty(p))
		{
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	}
	res = str.join('&');
	return (res && usePrefix) ? `?${res}` : res;
}