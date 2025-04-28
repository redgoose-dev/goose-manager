import icons from './svg-index.json'

export function iconRandomPick()
{
  return icons[Math.floor(Math.random() * icons.length)]
}
