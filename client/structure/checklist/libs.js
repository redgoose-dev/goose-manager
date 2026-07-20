import { filteringContent } from '@/libs/strings.js'

export const defaultContent = `- [ ] content body\n- [ ] content body\n\n`

// API 날짜 문자열은 UTC이므로, 호출자가 매니저 타임존을 전달하지 않으면 UTC를 사용한다.
const defaultTimezone = 'UTC'

function parseUTC(value)
{
  if (value instanceof Date) return new Date(value)
  let src = String(value)
  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(src)) src = `${src.replace(' ', 'T')}Z`
  const result = new Date(src)
  return isNaN(result.getTime()) ? null : result
}

function getDateTimeParts(value, timezone)
{
  const date = parseUTC(value)
  if (!date) return null
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || defaultTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(date)
  const result = {}
  for (const part of parts)
  {
    if (part.type !== 'literal') result[part.type] = Number(part.value)
  }
  return result
}

function getCalendarDate(parts)
{
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

function getDateFormat(_date, yesterday, timezone)
{
  const parts = getDateTimeParts(_date, timezone)
  if (!parts) return null
  const result = getCalendarDate(parts)
  if (yesterday) result.setUTCDate(result.getUTCDate() - 1)
  const year = result.getUTCFullYear()
  const month = String(result.getUTCMonth() + 1).padStart(2, '0')
  const day = String(result.getUTCDate()).padStart(2, '0')
  const time = [ parts.hour, parts.minute, parts.second ]
    .map(value => String(value).padStart(2, '0')).join(':')
  return `${year}-${month}-${day} ${time}`
}

/**
 * check time
 * 시간을 검사하여 아이템을 새로 추가할건지 마지막 데이터를 사용할건지 결정한다.
 * @param {string} regdate `0000-00-00 00:00:00`
 * @param {string} resetTime `00:00`
 * @param {string|Date} now
 * @param {string} timezone manager timezone
 * @return {string|null} 새로 만들 날짜를 리턴한다. 새로 만들 필요가 없다면 null을 리턴한다.
 */
export function checkTime(regdate, resetTime, now = new Date(), timezone = defaultTimezone)
{
  if (!regdate) return null
  const sourceParts = getDateTimeParts(regdate, timezone)
  const currentParts = getDateTimeParts(now, timezone)
  if (!(sourceParts && currentParts)) return null
  const [ hour = '0', minute = '0' ] = resetTime.split(':')
  const resetMinutes = (Number(hour) * 60) + Number(minute)
  const currentMinutes = (currentParts.hour * 60) + currentParts.minute
  const sourceMinutes = (sourceParts.hour * 60) + sourceParts.minute
  const sourceDate = getCalendarDate(sourceParts)
  const currentDate = getCalendarDate(currentParts)
  const currentBeforeReset = currentMinutes < resetMinutes

  if (currentBeforeReset)
  {
    // 리셋 전에는 현재 날짜와 전날 날짜의 항목을 모두 현재 항목으로 간주한다.
    // 전날 리셋 전 시각에 생성된 기존 데이터도 중복 생성하지 않도록 한다.
    const targetDate = new Date(currentDate)
    targetDate.setUTCDate(targetDate.getUTCDate() - 1)
    if (sourceDate.getTime() >= targetDate.getTime()) return null
    return getDateFormat(now, true, timezone)
  }

  // 리셋 후에는 마지막 항목의 시각도 리셋 시각과 비교해 논리 날짜를 계산한다.
  const sourceLogicalDate = new Date(sourceDate)
  if (sourceMinutes < resetMinutes)
  {
    sourceLogicalDate.setUTCDate(sourceLogicalDate.getUTCDate() - 1)
  }
  if (sourceLogicalDate.getTime() >= currentDate.getTime()) return null
  return getDateFormat(now, false, timezone)
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
