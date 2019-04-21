/**
 * get format date
 * make `year-month-day hour:minutes:second`
 *
 * @param {String} date
 * @param {Boolean} useTime
 */
export function getFormatDate(date=null, useTime=true)
{
	const dateSource = date.split(' ');
	if (useTime)
	{
		return `${dateSource[0]} ${dateSource[1]}`;
	}
	else
	{
		return dateSource[0];
	}
}

/**
 * convert date format
 * make `year-month-day hour:minutes:second` type Date
 *
 * @param {Date} date
 * @param {Boolean} time
 * @return {String}
 */
export function convertDateFormat(date=null, time=true)
{
	date = date || new Date();
	const src = date.toISOString().substr(0, 19).split('T');

	if (time)
	{
		return src[0];
	}
	else
	{
		return `${src[0]} ${src[1]}`;
	}
}