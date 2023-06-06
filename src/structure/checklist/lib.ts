import { compareDate } from '../../libs/date'

export const defaultContent = `- [ ] content body\n- [ ] content body\n\n`

/**
 * check reset time
 * @param {string} resetTime
 * @param {Date} now
 * @return {boolean} 리셋시간이 넘어갔다면 ture
 */
function checkResetTime(resetTime, now = undefined)
{
  const current = new Date(now)
  const reset = new Date(now)
  reset.setHours(Number(resetTime.split(':')[0]))
  reset.setMinutes(Number(resetTime.split(':')[1]))
  reset.setSeconds(0)
  reset.setMilliseconds(0)
  return current.getTime() > reset.getTime()
}

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 * regdate => `0000-00-00 00:00:00`
 * resetTime => `00:00`
 * return => 데이터를 새로 만드는 상황이라면 `true`
 */
export function checkTime(regdate: string, resetTime: string): boolean
{
  if (!regdate) return true
  const now = new Date()
  const regdateArray = regdate.split(' ')[0].split('-')
  const srcDate = new Date(Number(regdateArray[0]), Number(regdateArray[1])-1, Number(regdateArray[2]))
  // 마지막 데이터의 날짜가 같은지 이후인지 검사한다.
  if (compareDate(srcDate, now, '='))
  {
    // 현재 시간이 리셋시간 이후라면 true
    return checkResetTime(resetTime, now)
  }
  else if (compareDate(srcDate, now, '<'))
  {
    return true
  }
  return false
}

/**
 * replace mark
 * https://stackoverflow.com/a/62697836
 */
export function replaceMark(src: string, search: RegExp, replace: string, index: number): string
{
  let occurrence = 0
  return src.replace(search, (match) => {
    occurrence++
    if (occurrence === index) return replace
    return match
  })
}

/**
 * counting checkbox
 * @param {string} str
 * @return {object}
 */
export function countingCheckbox(str)
{
  let total = str ? (str.match(/\- \[x\]|\- \[ \]/g) || []).length : 0
  let checked = str ? (str.match(/\- \[x\]/g) || []).length : 0
  let percent = Math.floor(checked / total * 100) || 0
  return { total, checked, percent }
}
