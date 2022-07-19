import { authStore } from '../../store/auth'
import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

interface Options {
  url: string
  params?: {
    order?: string
    sort?: string
  }
}

interface Response {
  total: number
  index: {
    srl: number
    title: string
    meta: string[]
    self: boolean
  }[]
}

const defaultOptions: Options = {
  url: '/users/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
}

function filtering(res: any): Response
{
  const auth = authStore()
  return {
    total: res.total,
    index: res.index.map((item: any) => ({
      srl: item.srl,
      title: item.email,
      meta: [
        `srl: ${item.srl}`,
        `name: ${item.name}`,
        getDate(item.regdate),
        item.admin && `Admin`,
      ].filter(Boolean),
      self: auth.user?.srl === Number(item.srl),
    })),
  }
}

export async function getData(options?: any): Promise<Response>
{
  let op: Options = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  let res = await get(op.url, op.params)
  return filtering(res.data)
}
