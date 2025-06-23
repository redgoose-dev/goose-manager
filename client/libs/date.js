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
