import { authStore } from '../../store/auth'
import { get } from '../../libs/api'

const defaultOptions = {
  url: '',
  params: {},
}

function filtering(res)
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

export default async function getData(options)
{
  let op = Object.assign({}, defaultOptions, options)
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  let { data } = await get(op.url, op.params)
  return filtering(data)
}
