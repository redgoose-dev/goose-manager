import { request } from '../../libs/api.js'

export async function getData(srl)
{
  const { data, message } = await request(`/category/${srl}/`, {
    query: { fields: 'srl,name' },
  })
  if (!data) throw new Error(message)
  return data
}

export async function submit(srl)
{
  await request(`/category/${srl}/`, {
    method: 'delete',
  })
}
