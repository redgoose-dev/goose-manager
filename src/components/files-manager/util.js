import localStore from './store';

/**
 * control window
 * @param {boolean} sw
 * @param {string} key
 */
export function controlWindow(sw, key = undefined)
{
  let idx;
  if (key)
  {
    idx = localStore.state.window.indexOf(key);
    if (idx > -1) localStore.state.window.splice(idx, 1);
  }
  if (sw && key)
  {
    localStore.state.window.push(key);
  }
  else
  {
    localStore.state.window.pop();
  }
}
