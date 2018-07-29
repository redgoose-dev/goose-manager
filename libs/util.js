/**
 * sleep
 *
 * @param {Number} delay
 * @param {Number} timer
 * @return {Promise}
 */
export function sleep(delay=1000, timer=null)
{
	return new Promise(function(resolve){
		if (timer)
		{
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(() => { resolve(timer); }, delay);
	});
}