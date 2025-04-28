import { compareDate, dateFormat } from '../../libs/date'

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

function getDateFormat(date, yesterday)
{
  date = new Date(date)
  if (yesterday) date.setDate(date.getDate() - 1)
  return dateFormat(date, '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}')
}

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 * regdate => `0000-00-00 00:00:00`
 * resetTime => `00:00`
 * return => 데이터를 새로 만드는 상황이라면 `true`
 */
export function checkTime(regdate, resetTime)
{
  if (!regdate) return null
  const now = new Date()
  const regdateArray = regdate.split(' ')[0].split('-')
  const srcDate = new Date(Number(regdateArray[0]), Number(regdateArray[1])-1, Number(regdateArray[2]))
  // 마지막 데이터의 날짜가 같은지 이후인지 검사한다.
  if (compareDate(srcDate, now, '='))
  {
    // 같은 날짜일때..
    // 리셋시간을 넘겼으면 현재 시간을 리턴으로 넘기고, 넘기지 못했으면 마지막 데이터로 쓰게한다.
    return checkResetTime(resetTime, now) ? null: getDateFormat(now)
  }
  else if (compareDate(srcDate, now, '<'))
  {
    // 현재가 마지막 데이터보다 미래라면..
    // 더 이전의 날짜까지 데이터가 있기 때문에 현재 날짜로 바로 만든다.
    // 이 상황이 왔을때 24시가 넘어간 상태에서 리셋타임이 넘지 않았으면 어제날짜로 데이터를 만들어야 할것이다.
    if (checkResetTime(resetTime, now))
    {
      // 리셋시간 이후
      return getDateFormat(now)
    }
    else
    {
      // 리셋시간 이전
      // `어제=마지막데이터` 날짜조사하고 날짜가 같으면 그대로 쓰고 아니면 어제날짜로 데이터 만든다.
      let yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      return compareDate(srcDate, yesterday, '=') ? null : getDateFormat(now, true)
    }
  }
  else
  {
    // 현재가 마지막 데이터보다 과거라면..
    return null
  }
}

/**
 * replace mark
 * https://stackoverflow.com/a/62697836
 */
export function replaceMark(src, search, replace, index)
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
