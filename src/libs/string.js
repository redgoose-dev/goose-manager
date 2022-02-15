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
