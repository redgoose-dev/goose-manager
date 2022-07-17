let lastSelectedKey: number[] = [];

export function selectItem(src: boolean[], key: number, event: PointerEvent): boolean[]
{
  if (event.metaKey)
  {
    src[key] = !src[key];
    if (src[key])
    {
      lastSelectedKey.push(key);
    }
    else if (lastSelectedKey.includes(key))
    {
      lastSelectedKey.splice(lastSelectedKey.indexOf(key), 1);
    }
  }
  else if (event.shiftKey)
  {
    let range = [
      lastSelectedKey.length > 0 ? lastSelectedKey[lastSelectedKey.length - 1] : 0,
      key,
    ].sort((a, b) => (a - b));
    src = src.map((_, key: number) => {
      return (range[0] <= key && range[1] >= key);
    });
    if (!lastSelectedKey.length) lastSelectedKey = [key];
  }
  else
  {
    src = src.map((o,k) => {
      return k === key ? !o : false;
    });
    lastSelectedKey = src[key] ? [key] : [];
  }
  return src;
}

export function selectAll(src: boolean[], sw: boolean|undefined = undefined): boolean[]
{
  if (sw === undefined)
  {
    src = src.fill(!src.includes(true));
  }
  else
  {
    src = src.fill(sw);
  }
  lastSelectedKey = [];
  return src;
}
