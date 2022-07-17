import { fileManagerStore } from './store';

export function controlWindow(sw: boolean, key?: string): void
{
  const localStore = fileManagerStore()
  let idx;
  if (key)
  {
    idx = localStore.window.indexOf(key);
    if (idx > -1) localStore.window.splice(idx, 1);
  }
  if (sw && key)
  {
    localStore.window.push(key);
  }
  else
  {
    localStore.window.pop();
  }
}
