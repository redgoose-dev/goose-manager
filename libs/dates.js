/**
 * get format date
 * make `year-month-day hour:minutes:second`
 *
 * @param {String} date
 * @param {Boolean} useTime
 */
export function getFormatDate(date=null, useTime=true)
{
	// set
	let month = date.substring(4,6);
	let day = date.substring(6,8);
	let year = date.substring(0,4);

	if (useTime)
	{
		let hour = date.substring(8,10);
		let min = date.substring(10,12);
		let sec = date.substring(12,14);
		return `${year}-${month}-${day} ${hour}:${min}:${sec}`
	}

	return `${year}-${month}-${day}`;
}