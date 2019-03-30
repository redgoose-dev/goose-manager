import * as articlePreference from './articles/preference';


/**
 * get file size
 *
 * @param {number} bytes
 * @return {String}
 */
export function getFileSize(bytes)
{
	const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
	if (bytes === 0) return '0 Byte';
	let i = Math.floor(Math.log(bytes) / Math.log(1024));
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

/**
 * get article type label
 * 타입을 검사하면서 레이블을 가져옵니다.
 *
 * @param {string} type
 * @return {string}
 */
export function getArticleType(type)
{
	if (!type)
	{
		return articlePreference.typeLabels.public;
	}
	switch (type)
	{
		case articlePreference.TYPE_HIDDEN:
			return articlePreference.typeLabels[type];
		default:
			return '';
	}
}
