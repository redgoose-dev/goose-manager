/**
 * convert html string to element
 * https://stackoverflow.com/a/494348
 */
export function htmlToElement(str)
{
  let div = document.createElement('div')
  div.innerHTML = str.trim()
  return div.children[0]
}

/**
 * 숫자 한자리라면 앞에 `0`을 붙인다.
 */
export function twoDigit(day)
{
  return `0${day}`.slice(-2)
}

/**
 * `0-9a-z-_`만 서용할 수 있도록 검사한다.
 */
export function validateId(str)
{
  const reg = /^[A-Za-z0-9_-]*$/
  return reg.test(str)
}

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

export function getByte(bytes)
{
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ]
  if (bytes === 0) return '0 Byte'
  let i = Math.floor(Math.log(bytes) / Math.log(1024))
  return String(Math.round(bytes / Math.pow(1024, i))) + sizes[i]
}

export function serialize(obj, usePrefix = false)
{
  let str = []
  let res
  for (let p in obj)
  {
    if (obj.hasOwnProperty(p) && obj[p] !== undefined)
    {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  res = str.join('&')
  return (res && usePrefix ? '?' : '') + res
}

export function getPath(path)
{
  return path.replaceAll('//', '/')
}
