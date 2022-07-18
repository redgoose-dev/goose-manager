/**
 * convert html string to element
 * https://stackoverflow.com/a/494348
 */
export function htmlToElement(str: string): HTMLElement
{
  let div = document.createElement('div')
  div.innerHTML = str.trim()
  return (div.children[0] as HTMLElement) || null
}

/**
 * 숫자 한자리라면 앞에 `0`을 붙인다.
 */
export function twoDigit(day: number|string): string
{
  return `0${day}`.slice(-2)
}

/**
 * `0-9a-z-_`만 서용할 수 있도록 검사한다.
 */
export function validateId(str: string): boolean
{
  const reg = /^[A-Za-z0-9_-]*$/
  return reg.test(str)
}

export function printf(str: string, ...values: string[]): string
{
  for (let i = 0; i < values.length; i++)
  {
    let pattern = `\\{${i}\\}`
    let replace = new RegExp(pattern, 'g')
    str = str.replace(replace, values[i])
  }
  return str
}

export function getByte(bytes: number): string
{
  const sizes: string[] = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ]
  if (bytes === 0) return '0 Byte'
  let i = Math.floor(Math.log(bytes) / Math.log(1024))
  return String(Math.round(bytes / Math.pow(1024, i))) + sizes[i]
}

export function serialize(obj?: AnyObject, usePrefix: boolean = false): string
{
  let str: string[] = []
  let res: string
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

export function getPath(path: string): string
{
  return path.replaceAll('//', '/')
}
