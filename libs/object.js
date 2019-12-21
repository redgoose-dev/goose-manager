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
