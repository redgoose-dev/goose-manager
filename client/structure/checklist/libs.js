import { dateStore } from '@/store/app.js'
import { compareDate } from '@/libs/date.js'
import { filteringContent } from '@/libs/strings.js'

export const defaultContent = `- [ ] content body\n- [ ] content body\n\n`

/**
 * check reset time
 * @param {string} resetTime
 * @param {Date} now
 * @return {boolean} 현재 시간이 리셋시간을 넘었으면 ture
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

function parseDateTime(value)
{
  if (!value) return null
  if (value instanceof Date) return new Date(value)
  if (typeof value !== 'string')
  {
    const result = new Date(value)
    return isNaN(result.getTime()) ? null : result
  }
  const src = value.trim()
  const match = src.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)
  if (match)
  {
    const [ , year, month, day, hour = '0', minute = '0', second = '0' ] = match
    const result = new Date(Number(year), Number(month) - 1, Number(day), 0, Number(minute), Number(second))
    if (Number(hour) === 24)
    {
      result.setDate(result.getDate() + 1)
    }
    else
    {
      result.setHours(Number(hour))
    }
    return result
  }
  const result = new Date(src)
  return isNaN(result.getTime()) ? null : result
}

function getLogicalDate(date, resetTime)
{
  const result = parseDateTime(date)
  if (!result) return null
  const [ hour = '0', minute = '0' ] = resetTime.split(':')
  result.setMinutes(result.getMinutes() - ((Number(hour) * 60) + Number(minute)))
  result.setHours(0, 0, 0, 0)
  return result
}

function getDateFormat(_date, yesterday)
{
  const date = dateStore()
  _date = new Date(_date)
  if (yesterday) _date.setDate(_date.getDate() - 1)
  return `${date.format(_date, 'date-dash')} ${date.format(_date, 'time')}`
}

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 * @param {string} regdate `0000-00-00 00:00:00`
 * @param {string} resetTime `00:00`
 * @param {string|Date} now
 * @return {string|null} 새로 만들 날짜를 리턴한다. 새로 만들 필요가 없다면 null을 리턴한다.
 */
export function checkTime(regdate, resetTime, now = new Date())
{
  if (!regdate) return null
  const sourceDate = parseDateTime(regdate)
  const currentDate = parseDateTime(now)
  if (!(sourceDate && currentDate)) return null
  const sourceLogicalDate = getLogicalDate(sourceDate, resetTime)
  const currentLogicalDate = getLogicalDate(currentDate, resetTime)
  if (!(sourceLogicalDate && currentLogicalDate)) return null
  getDateFormat(currentDate) // TODO
  // 마지막 데이터의 논리 날짜가 현재와 같으면 그대로 사용한다.
  if (compareDate(sourceLogicalDate, currentLogicalDate, '='))
  {
    return null
  }
  else if (compareDate(sourceLogicalDate, currentLogicalDate, '<'))
  {
    // 현재가 마지막 데이터보다 미래라면 새 데이터를 만든다.
    // 리셋시간 전이면 아직 전날 체크리스트 구간이므로 날짜만 하루 당겨서 생성한다.
    if (checkResetTime(resetTime, currentDate))
    {
      return getDateFormat(currentDate)
    }
    else
    {
      return getDateFormat(currentDate, true)
    }
  }
  else
  {
    // 현재가 마지막 데이터보다 과거라면..
    return null
  }
}

/**
 * replace check
 * https://stackoverflow.com/a/62697836
 */
export function replaceCheck(src, search, replace, index)
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

/**
 * filtering data
 * @param {object} src
 * @return {object}
 */
export function filteringData(src)
{
  return {
    srl: src.srl,
    content: filteringContent(src.content),
    date: src.created_at,
    percent: src.percent,
    countFile: src.count_file || 0,
  }
}
