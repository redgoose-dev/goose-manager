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
