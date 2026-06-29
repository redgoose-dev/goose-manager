import { request } from '@/libs/api.js'

function filtering(src)
{
  return src.map(o => {
    return {
      srl: o.srl,
      content: o.content,
      regdate: o.created_at,
    }
  })
}

export async function getData(module, moduleSrl)
{
  const res = await request('/comment/', {
    query: {
      module,
      module_srl: moduleSrl,
      page: 0,
    },
  })
  if (!(res?.data?.index?.length > 0)) return { total: 0, index: [] }
  return {
    total: res.data.total,
    index: filtering(res.data.index),
  }
}

export async function createComment(module, moduleSrl, content)
{
  const res = await request('/comment/', {
    method: 'put',
    body: {
      module,
      module_srl: moduleSrl,
      content,
    },
  })
  if (!res?.data) throw new Error('만든 댓글을 데이터가 없습니다.')
  const newData = await request(`/comment/${res.data}/`)
  return filtering([ newData.data ])[0]
}
