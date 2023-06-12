export function err(path, type = 'warning', message)
{
  if (!window.DEBUG) return
  console.error(path.join('/'), `${type.toUpperCase()}`, message)
}
