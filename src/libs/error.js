/** @var {boolean} DEBUG */

/**
 * err
 * @param {array} path
 * @param {string} type
 * @param {string} message
 */
export function err(path, type = 'warning', message)
{
  if (window.DEBUG)
  {
    console.error(path.join('/'), `${type.toUpperCase()}`, message);
  }
}
