/**
 * get type article
 * @param {string} type
 * @return {string}
 */
export function getTypeArticle(type)
{
  switch (type)
  {
    case 'private':
    case 'ready':
      return type;
    default:
      return 'public';
  }
}

/**
 * get type label article
 * @param {string} type
 * @return {string}
 */
export function getTypeLabelArticle(type)
{
  switch (type)
  {
    case 'private':
      return 'Private';
    case 'ready':
      return 'Ready';
    case 'public':
      return 'Public';
  }
}
