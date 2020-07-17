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
  let str = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  str = str.substr(0, 19).split('T');
  return time ? `${str[0]} ${str[1]}` : str[0];
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

/**
 * convert date in service
 * 서비스 전용 날짜 변환툴 (regdate,order 필드를 선택하여 출력할 수 있도록 도와준다.)
 *
 * @param {object} item
 * @param {string} field
 * @return {string}
 */
export function convertDateInService(item, field)
{
  switch (field)
  {
    case 'order':
      return getFormatDate(item.order, false);
    case 'regdate':
    default:
      return getFormatDate(item.regdate, false);
  }
}
