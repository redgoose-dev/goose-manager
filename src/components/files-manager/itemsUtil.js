/**
 * array to text for return
 * @param {string[]} src
 * @return {string}
 */
function arrayToTextForReturn(src)
{
  return src.join('\n\n') + `\n`;
}

/**
 * create markdown items
 * @param {object[]} src
 * @return {string}
 */
export function createMarkdownItems(src)
{
  let str = src.map(item => {
    if (/^image/.test(item.type))
    {
      return `![${item.name}](${item.path})`;
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`;
    }
  });
  return arrayToTextForReturn(str);
}

/**
 * create html items
 * @param {object[]} src
 * @return {string}
 */
export function createHtmlItems(src)
{
  let str = src.map(item => {
    if (/^image/.test(item.type))
    {
      return `<p><img src="${item.path}" alt="${item.name}"/></p>`;
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`;
    }
  });
  return arrayToTextForReturn(str);
}

/**
 * create address items
 * @param {object[]} src
 * @return {string}
 */
export function createAddressItems(src)
{
  return arrayToTextForReturn(src.map(item => (item.path)));
}
