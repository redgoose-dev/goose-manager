import { fileManagerStore } from '../../store/files-manager'

export function controlWindow(sw, key)
{
  const localStore = fileManagerStore()
  let idx
  if (key)
  {
    idx = localStore.window.indexOf(key)
    if (idx > -1) localStore.window.splice(idx, 1)
  }
  if (sw && key)
  {
    localStore.window.push(key)
  }
  else
  {
    localStore.window.pop()
  }
}

export function arrayToTextForReturn(src)
{
  return src.join('\n') + `\n`
}
