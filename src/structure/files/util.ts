export function createFullPath(path: string): string
{
  if (!path) return '';
  return API_URL + '/' + path;
}
