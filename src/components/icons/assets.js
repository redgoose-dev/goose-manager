import icons from './svg-index.json';

/**
 * icon random pick
 * @return {string}
 */
export function iconRandomPick()
{
  return icons[Math.floor(Math.random() * icons.length)];
}
