import icons from './svg-index.json'

export function iconRandomPick(): string
{
  return icons[Math.floor(Math.random() * icons.length)];
}
