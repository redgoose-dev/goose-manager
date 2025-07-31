import { twoDigit } from './strings.js'

const monthNames = [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ]
const weekNames = [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ]
const weekShortNames = [ '일', '월', '화', '수', '목', '금', '토' ]

/**
 * get date
 * convert `yyyy-mm-dd hh:mm:ss` to `yyyy-mm-dd`
 */
export function getDate(date)
{
  if (!date) return ''
  return date.split(' ')[0]
}

/**
 * convert date format
 * format guide: `{yyyy}-{MM}-{dd} / {month},{week},{weekShort} / {hh}:{mm}:{ss}`
 * @param {Date} date
 * @param {string} format
 * @return {string}
 */
export function dateFormat(date, format)
{
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()))
  mix = mix.replace(/\{MM\}/, twoDigit(date.getMonth() + 1))
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()))
  mix = mix.replace(/\{month\}/, monthNames[date.getMonth()])
  mix = mix.replace(/\{week\}/, weekNames[date.getDay()])
  mix = mix.replace(/\{weekShort\}/, weekShortNames[date.getDay()])
  mix = mix.replace(/\{hh\}/, twoDigit(date.getHours()))
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMinutes()))
  mix = mix.replace(/\{ss\}/, twoDigit(date.getSeconds()))
  return mix
}

/**
 * compare date
 * 시간을 0으로 변경하고 `년,월,일`로 날짜를 비교한다.
 * @param {string|Date} date1
 * @param {string|Date} date2
 * @param {string} compare - 비교 연산자: '<', '>', '='
 * @return {boolean}
 */
export function compareDate(date1, date2, compare = '<')
{
  if (!(date1 && date2)) throw new Error('no date1 or date2')
  date1 = new Date(date1)
  date2 = new Date(date2)
  let d1 = date1.setHours(0,0,0,0)
  let d2 = date2.setHours(0,0,0,0)
  switch (compare)
  {
    case '<':
      return d1 < d2
    case '>':
      return d1 > d2
    case '=':
    default:
      return d1 === d2
  }
}

/**
 * check regdate
 * `0000-00-00`형식이거나 올바른 날짜인지 검사한다.
 * @param {string} str
 * @return {boolean}
 */
export function checkRegdate(str = '')
{
  if (str.length !== 10) return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false
  return !isNaN(new Date(str).getTime())
}
