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
