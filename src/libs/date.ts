import { twoDigit } from './string'
import { message } from '../message'

/**
 * get date
 * convert `yyyy-mm-dd hh:mm:ss` to `yyyy-mm-dd`
 */
export function getDate(date: string): string
{
  return date.split(' ')[0]
}

/**
 * get time
 * convert `yyyy-mm-dd hh:mm:ss` to `hh:mm:ss`
 */
export function getTime(date: string): string
{
  return date.split(' ')[1]
}

/**
 * set date
 */
export function setDate(src: string): Date
{
  return new Date(src)
}

/**
 * convert date format
 * format guide: `{yyyy}-{MM}-{dd} / {month},{week},{weekShort} / {hh}:{mm}:{ss}`
 */
export function dateFormat(date: Date, format: string): string
{
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()))
  mix = mix.replace(/\{MM\}/, twoDigit(date.getMonth() + 1))
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()))
  mix = mix.replace(/\{month\}/, message.monthNames[date.getMonth()])
  mix = mix.replace(/\{week\}/, message.weekNames[date.getDay()])
  mix = mix.replace(/\{weekShort\}/, message.weekShortNames[date.getDay()])
  mix = mix.replace(/\{hh\}/, twoDigit(date.getHours()))
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMinutes()))
  mix = mix.replace(/\{ss\}/, twoDigit(date.getSeconds()))
  return mix
}

/**
 * check order date
 * `0000-00-00`형식이거나 올바른 날짜인지 검사한다.
 */
export function checkOrderDate(str: string = ''): boolean
{
  if (str.length !== 10) return false
  if (!/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(str)) return false
  return !isNaN(new Date(str).getTime())
}

/**
 * compare date
 * 시간을 0으로 변경하고 `년,월,일`로 날짜를 비교한다.
 */
export function compareDate(date1: Date, date2: Date, compare: string = '<'): boolean
{
  if (!(date1 && date2)) throw new Error('no date1 or date2')
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
