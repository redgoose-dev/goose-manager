/**
 * 카멜케이스 문자로 변경
 * @param {string} str
 * @return {string}
 */
export function toCamelCase(str)
{
  return str.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
}

/**
 * printf
 * @param {string} str
 * @param {...*} values
 * @return {string}
 * @example
 * ```js
 * const str = printf('Hello {0} {1}', 'World', '!')
 * console.log(str) // Hello World !
 * ```
 */
export function printf(str, ...values)
{
  for (let i = 0; i < values.length; i++)
  {
    let pattern = `\\{${i}\\}`
    let replace = new RegExp(pattern, 'g')
    str = str.replace(replace, values[i])
  }
  return str
}

/**
 * get byte
 * @param {number} bytes
 * @return {string}
 */
export function getByte(bytes)
{
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ]
  if (bytes === 0) return '0 Byte'
  let i = Math.floor(Math.log(bytes) / Math.log(1024))
  return String(Math.round(bytes / Math.pow(1024, i))) + sizes[i]
}

/**
 * create random text
 * @param {number} length
 * @return {string}
 */
export function createRandomText(length)
{
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let len = characters.length
  for (let i = 0; i < length; i++)
  {
    result += characters.charAt(Math.floor(Math.random() * len))
  }
  return result
}

/**
 * `0-9a-z-_`만 서용할 수 있도록 검사한다.
 * @param {string} str
 * @return {boolean}
 */
export function validateCode(str)
{
  const reg = /^[A-Za-z0-9_-]*$/
  return reg.test(str)
}

/**
 * serialize object to query string
 * @param {object} obj
 * @param {boolean} usePrefix
 * @param {boolean} useEncode
 * @return {string}
 */
export function serialize(obj, usePrefix = false, useEncode = true)
{
  let str = []
  let res
  for (let p in obj)
  {
    if (!obj.hasOwnProperty(p) || obj[p] === undefined || obj[p] === null) continue
    if (typeof obj[p] === 'number' && isNaN(obj[p])) continue
    const value = useEncode ? encodeURIComponent(obj[p]) : obj[p]
    str.push(encodeURIComponent(p) + '=' + value)
  }
  res = str.join('&')
  return (res && usePrefix ? '?' : '') + res
}
