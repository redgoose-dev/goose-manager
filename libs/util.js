/**
 * sleep
 *
 * @param {Number} delay
 * @param params
 * @param {Number} timer
 * @return {Promise}
 */
export function sleep(delay=1000, params=null, timer=null)
{
	return new Promise(function(resolve){
		if (timer)
		{
			clearTimeout(timer);
			timer = setTimeout(() => { resolve(params, timer); }, delay);
		}
		else
		{
			setTimeout(() => { resolve(params, this); }, delay);
		}
	});
}

export function browser()
{
	if (!navigator) return null;

	if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
	{
		return 'chrome';
	}
	else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
	{
		return 'firefox';
	}
	else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/))
	{
		return 'safari';
	}
	else if (navigator.userAgent.toLowerCase().indexOf('op') > -1)
	{
		return 'opera';
	}
	else
	{
		return 'unknown';
	}
}