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

/**
 * check order date
 * `0000-00-00`형식이거나 올바른 날짜인지 검사한다.
 *
 * @param {string} str
 * @return {boolean}
 */
export function checkOrderDate(str='')
{
  if (str.length !== 10) return false;
  if (!/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(str)) return false;
  return !isNaN(new Date(str).getTime());
}
