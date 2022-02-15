/** @var {boolean} DEBUG */

/**
 * error record
 *
 * @param {Error} err
 */
export function errorRecord(err)
{
  if (window.DEBUG) console.error('SERVICE ERROR:', err.message);
}

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
