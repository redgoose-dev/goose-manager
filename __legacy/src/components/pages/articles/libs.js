import { serialize } from '../../../libs/string'

export function getTypeArticle(type)
{
  switch (type)
  {
    case 'private':
    case 'ready':
      return type
    default:
      return 'public'
  }
}

export function getTypeLabelArticle(type)
{
  switch (type)
  {
    case 'private':
      return 'Private'
    case 'ready':
      return 'Ready'
    case 'public':
      return 'Public'
    default:
      return ''
  }
}

export function createQueries(keys, query)
{
  if (!(keys?.length > 0)) return ''
  let obj = {}
  if (keys.includes('category')) obj.category = query.category || undefined
  if (keys.includes('page')) obj.page = Number(query.page) > 1 ? Number(query.page) : undefined
  return serialize(obj, true)
}
