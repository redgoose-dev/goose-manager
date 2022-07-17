import { authStore } from '../../store/auth'
import { get } from '../../libs/api'

interface Options {
  url: string
  params?: AnyObject
}

const defaultOptions: Options = {
  url: '',
  params: {},
};

async function request({ url, params }: Options): Promise<AnyObject>
{
  return await get(url, params)
}

function filtering(res: AnyObject): AnyObject
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


export default async function getData(options: Options): Promise<AnyObject>
{
  let op = Object.assign({}, defaultOptions, options)
  if (options.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params);
  }
  let { data } = await request(op);
  return filtering(data);
}
