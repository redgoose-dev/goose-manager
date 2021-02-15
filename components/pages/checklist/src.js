import { compareDate } from '~/libs/dates';

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
