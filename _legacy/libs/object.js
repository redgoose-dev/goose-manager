/**
 * get value
 * 중첩되어있는 객체의 값을 가져오는 역할을 한다.
 * getValue({}, 'key1', 'key2')
 *
 * @param {object} obj
 * @param {string} args
 *
 * @return {*}
 */
export function getValue(obj, ...args)
{
  return args.reduce((obj, level) => obj && obj[level], obj);
}

/**
 * convert raw object
 * 특수하게 만들어진 객체(옵져버)를 순수한 객체로 변환해줍니다.
 *
 * @param {object} src
 * @return {object}
 */
export function convertRaw(src)
{
  return JSON.parse(JSON.stringify(src));
}

/**
 * set value in object
 * https://stackoverflow.com/a/46818701
 *
 * @param {object} obj
 * @param {string} path
 * @param {*} value
 * @return {object}
 */
export function set(obj, path, value)
{
  const pList = path.split('.');
  const key = pList.pop();
  const pointer = pList.reduce((accumulator, currentValue) => {
    if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
    return accumulator[currentValue];
  }, obj);
  pointer[key] = value;
  return obj;
}

/**
 * get values in object
 *
 * @param {array} src
 * @param {string} key
 * @param {string|number} value
 * @return {array}
 */
export function getValues(src, key, value)
{
  let arr = [];
  src.forEach((o,k) => {
    if (o[key] === value) arr.push(o);
  });
  return arr;
}

/**
 * get key in array
 *
 * @param {array} src
 * @param {string} key
 * @param {string|number} value
 * @return {number}
 */
export function getKey(src, key, value)
{
  for (let i=0; src.length>i; i++)
  {
    if (src[i][key] === value) return i;
  }
}

/**
 * make range number
 */
export const range = (from, to, step) => [...Array(Math.floor((to - from) / step) + 1)].map((_, i) => from + i * step);
