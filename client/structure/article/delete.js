import { request } from '../../libs/api.js'

export async function getData(srl)
{
  const { data, message } = await request(`/article/${srl}/`, {
    query: { fields: 'srl,title' },
  })
  if (!data) throw new Error(message)
  return {
    srl: data.srl,
    name: data.title,
  }
}

export async function submit(srl)
{
  await request(`/article/${srl}/`, {
    method: 'delete',
  })
}
