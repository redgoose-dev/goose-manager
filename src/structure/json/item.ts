import { get } from '../../libs/api'

interface Options {
  url: string
  params?: any
}

interface Response {
  srl: number
  name?: string
  description?: string
  json?: any
  regdate?: string
}

const defaultOptions: Options = {
  url: '',
  params: {},
}

function filtering(res: any): Response
{
  return {
    srl: Number(res.srl),
    name: res.name,
    description: res.description,
    json: JSON.stringify(res.json, null, 2),
    regdate: res.regdate,
  }
}

export default async function getData(options: Options): Promise<Response>
{
  let op: Options = Object.assign({}, defaultOptions, options)
  if (options.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params)
  }
  const res = await get(op.url, op.params)
  return filtering(res.data)
}
