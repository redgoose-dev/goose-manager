const { VITE_API_URL } = import.meta.env

export function createFullPath(path)
{
  if (!path) return ''
  return VITE_API_URL + '/' + path
}
