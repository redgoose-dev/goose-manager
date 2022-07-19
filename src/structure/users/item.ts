import { authStore } from '../../store/auth'
import { get } from '../../libs/api'

interface Options {
  url: string
  params?: any
}

interface Response {
  srl: number
  email: string
  name: string
  regdate: string
  admin: boolean
  self: boolean
}

const defaultOptions: Options = {
  url: '',
  params: {},
}

function filtering(res: any): Response
{
  const auth = authStore()
  return {
    srl: Number(res.srl),
    email: res.email,
    name: res.name,
    regdate: res.regdate,
    admin: res.admin > 0,
    self: auth.user?.srl === Number(res.srl),
  }
}

export default async function getData(options?: Options): Promise<Response>
{
  let op: Options = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  let { data } = await get(op.url, op.params)
  return filtering(data)
}
