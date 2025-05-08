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
 * get resize path
 * @param {string} src
 * @param {string} query
 * @return {string}
 */
export function getResizePath(src, query = 'width=640&height=480')
{
  // TODO: 나중에 좀 변경하기. 리사이즈되는 방식으로..
  return src
}
