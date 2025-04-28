import { authStore } from '../../store/auth'
import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

const defaultOptions = {
  url: '/users/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
}

function filtering(res)
{
  const auth = authStore()
  return {
    total: res.total,
    index: res.index.map(item => ({
      srl: item.srl,
      title: item.email,
      meta: [
        `번호:${item.srl}`,
        `이름:${item.name}`,
        getDate(item.regdate),
        item.admin && '관리자',
      ].filter(Boolean),
      self: auth.user?.srl === Number(item.srl),
    })),
  }
}

export async function getData(options)
{
  let op = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  let res = await get(op.url, op.params)
  return filtering(res.data)
}
