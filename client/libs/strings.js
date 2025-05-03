/**
 * 카멜케이스 문자로 변경
 * @param {string} str
 * @return {string}
 */
export function toCamelCase(str)
{
  return str.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
}
