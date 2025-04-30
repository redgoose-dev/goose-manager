/**
 * color text
 * @param {string} message
 * @param {'white'|'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'} color
 */
export function colorText(message, color) {
  const assets = {
    white: '\x1b[37m',
    black: '\x1b[31m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  }
  if (assets[color]) return `${assets[color]}${message}\x1b[0m`
  else return message
}

/**
 * 숫자 한자리라면 앞에 `0`을 붙인다.
 */
export function twoDigit(day)
{
  return `0${day}`.slice(-2)
}

/**
 * convert date format
 * guide: `{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}`
 * @param {Date} date
 * @param {string} format
 * @returns {string}
 */
export function dateFormat(date, format)
{
  if (!date) date = new Date()
  let mix = format.replace(/\{yyyy\}/, String(date.getFullYear()))
  mix = mix.replace(/\{MM\}/, twoDigit(date.getMonth() + 1))
  mix = mix.replace(/\{dd\}/, twoDigit(date.getDate()))
  mix = mix.replace(/\{hh\}/, twoDigit(date.getHours()))
  mix = mix.replace(/\{mm\}/, twoDigit(date.getMinutes()))
  mix = mix.replace(/\{ss\}/, twoDigit(date.getSeconds()))
  return mix
}
