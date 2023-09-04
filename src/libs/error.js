const { VITE_DEBUG } = import.meta.env

export function err(path, type = 'warning', message)
{
  if (VITE_DEBUG !== 'true') return
  console.error(path.join('/'), `${type.toUpperCase()}`, message)
}
