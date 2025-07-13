import { request } from '../../libs/api.js'

function filtering(module, src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    let href = ''
    switch (module)
    {
      case 'article':
        href = `/article/?tag=${o.srl}`
        break
      case 'json':
        href = `/json/?tag=${o.srl}`
        break
    }
    return {
      href,
      label: o.name,
    }
  })
}

export async function getData(module)
{
  const res = await request('/tag/', {
    query: {
      module,
    },
  })
  return filtering(module, res.data)
}
