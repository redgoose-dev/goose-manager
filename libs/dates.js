export const month = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];
export const weeks = [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ];
export const shortWeeks = [ '일', '월', '화', '수', '목', '금', '토' ];

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

/**
 * compare date
 *
 * @param {Date} date1
 * @param {Date} date2
 * @param {String} compare
 * @return {Boolean}
 * @throws
 * */
export function compareDate(date1, date2, compare = '<')
{
  if (!(date1 && date2)) throw new Error('no date1 or date2');
  let d1 = date1.setHours(0,0,0,0);
  let d2 = date2.setHours(0,0,0,0);
  switch (compare)
  {
    case '<':
      return d1 < d2;
    case '>':
      return d1 > d2;
    case '=':
    default:
      return d1 === d2;
  }
}

/**
 * check today
 *
 * @param {Date} date
 * @return {boolean}
 */
export function checkToday(date)
{
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
