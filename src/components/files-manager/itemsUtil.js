import { getRandomNumber } from '../../libs/number'

export function createMarkdownItems(src)
{
  return src.map(item => {
    if (/^image/.test(item.type))
    {
      return `![${item.name}](${item.path})`
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`
    }
  })
}

export function createHtmlItems(src)
{
  return src.map(item => {
    if (/^image/.test(item.type))
    {
      return `<p><img src="${item.path}" loading="lazy" alt="${item.name}"/></p>`
    }
    else
    {
      return `<p><a href="${item.path}" target="_blank">${item.name}</a></p>`
    }
  })
}

const groupLabels = {
  size: [ '0mb ~ 1mb', '1mb ~ 5mb', '5mb ~', 'none' ],
  imageSize: [ '0px ~ 1000px', '1000px ~ 3000px', '3000px ~', 'none' ],
}
export function getIndexItems(index, groupKey)
{
  switch (groupKey)
  {
    case 'type':
      return index.reduce((acc, obj, n) => {
        const key = obj.type.split('/')[0]
        if (!acc[key]) acc[key] = []
        acc[key].push({ ...obj, key: n })
        return acc
      }, {})
    case 'size':
      return index.reduce((acc, obj, n) => {
        let key
        if (obj.size < 1000000) key = groupLabels.size[0]
        else if (obj.size > 1000000 && obj.size < 5000000) key = groupLabels.size[1]
        else if (obj.size > 5000000) key = groupLabels.size[2]
        else key = groupLabels.size[3]
        if (!acc[key]) acc[key] = []
        acc[key].push({ ...obj, key: n })
        return acc
      }, {})
    case 'imageSize':
      return index.reduce((acc, obj, n) => {
        let key
        const size = Math.max(obj.json?.width, obj.json?.height)
        if (size < 1000) key = groupLabels.imageSize[0]
        else if (size > 1000 && size < 3000) key = groupLabels.imageSize[1]
        else if (size > 3000) key = groupLabels.imageSize[2]
        else key = groupLabels.imageSize[3]
        if (!acc[key]) acc[key] = []
        acc[key].push({ ...obj, key: n })
        return acc
      }, {})
    default:
      return index.map((o,n) => ({ ...o, key: n }))
  }
}
