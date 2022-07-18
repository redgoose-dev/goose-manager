export function err(path: string[], type: string = 'warning', message: string): void
{
  if (!window.DEBUG) return
  console.error(path.join('/'), `${type.toUpperCase()}`, message)
}
