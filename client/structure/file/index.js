import { useRoute } from 'vue-router'
import { preferenceStore } from '../../store/app.js'
import { request } from '../../libs/api.js'
import { getResizePath } from '../../libs/file.js'
import { getByte } from '../../libs/strings.js'
import { getDate } from '../../libs/date.js'

let _route

function filtering(src)
{
  return {
    total: src.total,
    index: src.index.map(o => {
      let thumbnail, icon
      const path = getResizePath(o.srl)
      if (/^image/.test(o.mime))
      {
        thumbnail = `${path}?w=640&h=480&q=65`
      }
      else if (o.mime === 'application/pdf')
      {
        icon = 'file-text'
      }
      else
      {
        icon = 'file'
      }
      let moduleUrl = ''
      switch (o.module)
      {
        case 'article':
        case 'json':
        case 'checklist':
          moduleUrl = `/${o.module}/${o.module_srl}/`
          break
      }
      return {
        srl: o.srl,
        title: o.name,
        href: path,
        thumbnail,
        icon,
        meta: [
          `날짜: ${getDate(o.created_at)}`,
          `타입: ${o.mime.split('/')[0]}`,
          `사이즈: ${getByte(o.size)}`,
        ],
        nav: [
          moduleUrl && { label: '모듈 바로가기', href: moduleUrl },
        ].filter(Boolean),
      }
    })
  }
}

export async function getData()
{
  if (!_route) _route = useRoute()
  const preference = preferenceStore()
  const { data, message } = await request('/file/', {
    query: {
      order: 'srl',
      sort: 'desc',
      size: preference.file.pagePerSize,
      page: Number(_route.query.page) > 1 ? Number(_route.query.page) : undefined,
    }
  })
  if (!data) throw new Error(message)
  return filtering(data)
}
