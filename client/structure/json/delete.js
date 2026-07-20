import { request } from '../../libs/api.js'

export async function getData(srl)
{
  const { data, message } = await request(`/json/${srl}/`, {
    query: { field: 'srl,name' },
  })
  if (!data) throw new Error(message)
  return data
}

export async function submit(srl)
{
  await request(`/json/${srl}/`, {
    method: 'delete',
  })
}
