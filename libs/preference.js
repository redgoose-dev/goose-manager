const PREFERENCE_KEY = 'preference';

/**
 * get method name
 *
 * @param {string} name
 * @return {string}
 */
function getMethod(name)
{
	if (name === 'sessionStorage')
	{
		return 'sessionStorage';
	}
	else
	{
		return 'localStorage';
	}
}

/**
 * save preference
 *
 * @param {object} value
 * @param {string} method
 */
export function save(value={}, method=undefined)
{
	if (!window) return;
	try
	{
		window[getMethod(method)].setItem(PREFERENCE_KEY, JSON.stringify(value));
	}
	catch(e)
	{}
}

/**
 * load preference
 *
 * @param {string} method
 */
export function load(method=undefined)
{
	if (!window) return;
	try
	{
		return JSON.parse(window[getMethod(method)].getItem(PREFERENCE_KEY));
	}
	catch(e)
	{
		return null;
	}
}

/**
 * clear preference
 *
 * @param {string} method
 */
export function clear(method=undefined)
{
	if (!window) return;
	window[getMethod(method)].clear();
}