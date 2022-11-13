/**
 * filtering hostname
 *
 * @param {string} host
 * @return {string}
 */
export function filteringHostname(host)
{
  return host.replace(/localhost/i, '0.0.0.0')
}
