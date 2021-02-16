import { compareDate, month, weeks, shortWeeks } from '~/libs/dates';
import { twoDigit } from '~/libs/text';

export const defaultContent = `- [ ] content body\n- [ ] content body\n\n`;

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 *
 * @param {String|String[]} src `0000-00-00`
 * @param {String|String[]} resetTime `00:00`
 * @return {Boolean} 데이터를 새로 만드는 상황이라면 true
 */
export function checkTime(src, resetTime)
{
  const now = new Date();
  const reset = new Date();
  reset.setHours(Number(resetTime.split(':')[0]));
  reset.setMinutes(Number(resetTime.split(':')[1]));
  reset.setSeconds(0);
  reset.setMilliseconds(0);
  src = src.split('-');
  let srcDate = new Date(Number(src[0]), Number(src[1])-1, Number(src[2]));
  return ((now.getTime() > reset.getTime()) && compareDate(srcDate, now, '<'))
}

/**
 * convert date format
 *
 * @param {Date} date
 * @param {String} format
 * @return {String}
 */
export function convertDateFormat(date, format)
{
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()));
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMonth() + 1));
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()));
  mix = mix.replace(/\{month\}/, month[date.getMonth()]);
  mix = mix.replace(/\{week\}/, weeks[date.getDay()]);
  mix = mix.replace(/\{weekShort\}/, shortWeeks[date.getDay()]);
  return mix;
}

/**
 * counting checkbox in markdown
 *
 * @param {String} str
 * @return {Object}
 * */
export function countingCheckbox(str)
{
  let total = str ? (str.match(/\- \[x\]|\- \[ \]/g) || []).length : 0;
  let checked = str ? (str.match(/\- \[x\]/g) || []).length : 0;
  let percent = Math.floor(checked / total * 100);
  return { total, checked, percent };
}

/**
 * replace mark
 * https://stackoverflow.com/a/62697836
 *
 * @param {String} src
 * @param {RegExp} search
 * @param {String} replace
 * @param {Number} index
 * @return {String}
 */
export function replaceMark(src, search, replace, index)
{
  let occurrence = 0;
  return src.replace(search, (match) => {
    occurrence++;
    if (occurrence === index) return replace;
    return match;
  });
}
