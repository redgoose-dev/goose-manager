import { get } from '../../libs/api'
import { createFullPath } from './util'
import { getByte, getResizePath } from '../../libs/string'
import { getDate } from '../../libs/date'

async function requestFiles(targetSrl, module)
{
  const { success, message, data } = await get('/files/', {
    module,
    target: targetSrl,
    order: 'srl',
    sort: 'desc',
    unlimit: 1,
  })
  if (!success) throw new Error(message)
  return {
    total: data.total,
    index: data?.index.map(item => {
      let image = null
      if (Math.max(item.json?.width || 0, item.json?.height || 0) > 1000)
      {
        image = getResizePath(item.path)
      }
      else if (/^image/.test(item.type))
      {
        image = createFullPath(item.path)
      }
      return {
        srl: item.srl,
        title: item.name,
        href: createFullPath(item.path),
        path: item.path,
        image,
        meta: [
          item.type,
          `용량:${getByte(item.size)}`,
          `날짜:${getDate(item.regdate)}`,
        ].filter(Boolean),
        json: item.json,
      }
    }),
  }
}

export default async function getData(targetSrl, module)
{
  let [ files ] = await Promise.all([
    requestFiles(targetSrl, module),
  ])
  return {
    files,
  }
}
