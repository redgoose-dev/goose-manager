/** @var {string} API_URL */

export function createFullPath(path)
{
  if (!path) return null;
  return API_URL + '/' + path;
}
