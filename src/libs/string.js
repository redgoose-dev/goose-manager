/**
 * convert html string to element
 * https://stackoverflow.com/a/494348
 * @param {string} str
 * @return {HTMLElement}
 */
export function htmlToElement(str)
{
  let div = document.createElement('div');
  div.innerHTML = str.trim();
  return div.children[0] || null;
}

/**
 * 2 digit
 * @param {number|string} day
 * @return {string}
 */
export function twoDigit(day)
{
  return `0${day}`.slice(-2);
}

/**
 * validate id
 * `0-9a-z-_`만 서용할 수 있도록 검사한다.
 * @param {string} str
 * @return {boolean}
 */
export function validateId(str)
{
  const reg = /^[A-Za-z0-9_-]*$/;
  return reg.test(str);
}

/**
 * printf
 * @param {string} str
 * @param {string} values
 * @return {string}
 */
export function printf(str, ...values)
{
  for (let i = 0; i < values.length; i++)
  {
    let pattern = `\\{${i}\\}`;
    let replace = new RegExp(pattern, 'g');
    str = str.replace(replace, values[i]);
  }
  return str;
}

/**
 * get byte
 * @param {number} bytes
 * @return {string}
 */
export function getByte(bytes)
{
  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
  if (bytes === 0) return '0 Byte';
  let i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
}

/**
 * serialize
 * object to queryString
 * @param {object} obj
 * @param {boolean} usePrefix
 * @return {string}
 */
export function serialize(obj, usePrefix=false)
{
  let str = [];
  let res = '';
  for (let p in obj)
  {
    if (obj.hasOwnProperty(p))
    {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  res = str.join('&');
  return (res && usePrefix ? '?' : '') + res;
}
