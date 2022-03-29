import { twoDigit } from '~/libs/text';

export const month = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];
export const weeks = [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ];
export const shortWeeks = [ '일', '월', '화', '수', '목', '금', '토' ];

/**
 * get format date
 * make `year-month-day hour:minutes:second`
 *
 * @param {string} date
 * @param {boolean} useTime
 * @return {string}
 */
export function getFormatDate(date=null, useTime=true)
{
	const src = date.split(' ');
	return useTime ? `${src[0]} ${src[1]}` : src[0];
}

/**
 * convert date format
 *
 * @param {Date} date
 * @param {string} format `{yyyy}-{mm}-{dd} / {month},{week},{weekShort} / {hh}:{mm}:{ss}`
 * @return {string}
 */
export function dateFormat(date, format)
{
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()));
  mix = mix.replace(/\{MM\}/, twoDigit(date.getMonth() + 1));
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()));
  mix = mix.replace(/\{month\}/, month[date.getMonth()]);
  mix = mix.replace(/\{week\}/, weeks[date.getDay()]);
  mix = mix.replace(/\{weekShort\}/, shortWeeks[date.getDay()]);
  mix = mix.replace(/\{hh\}/, twoDigit(date.getHours()));
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMinutes()));
  mix = mix.replace(/\{ss\}/, twoDigit(date.getSeconds()));
  return mix;
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
 * compare date
 *
 * @param {Date} date1
 * @param {Date} date2
 * @param {string} compare
 * @return {boolean}
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
