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