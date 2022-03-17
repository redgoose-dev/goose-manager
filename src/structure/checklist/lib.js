import { compareDate } from '../../libs/date';

export const defaultContent = `- [ ] content body\n- [ ] content body\n\n`;

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 * @param {string|string[]} regdate `0000-00-00 00:00:00`
 * @param {string|string[]} resetTime `00:00`
 * @return {boolean} 데이터를 새로 만드는 상황이라면 `true`, 예) 현재 시간이 `오늘 05:00`보다 지난 시간이라면 `true`
 */
export function checkTime(regdate, resetTime)
{
  const now = new Date();
  const reset = new Date();
  reset.setHours(Number(resetTime.split(':')[0]));
  reset.setMinutes(Number(resetTime.split(':')[1]));
  reset.setSeconds(0);
  reset.setMilliseconds(0);
  regdate = regdate.split(' ')[0].split('-');
  let srcDate = new Date(Number(regdate[0]), Number(regdate[1])-1, Number(regdate[2]));
  return ((now.getTime() > reset.getTime()) && compareDate(srcDate, now, '<'));
}

/**
 * replace mark
 * https://stackoverflow.com/a/62697836
 * @param {string} src
 * @param {RegExp} search
 * @param {string} replace
 * @param {number} index
 * @return {string}
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

/**
 * counting checkbox in markdown
 * @param {string} str
 * @return {{ total, checked, percent }}
 * */
export function countingCheckbox(str)
{
  let total = str ? (str.match(/\- \[x\]|\- \[ \]/g) || []).length : 0;
  let checked = str ? (str.match(/\- \[x\]/g) || []).length : 0;
  let percent = Math.floor(checked / total * 100) || 0;
  return { total, checked, percent };
}
