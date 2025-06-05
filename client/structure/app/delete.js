import { request } from '../../libs/api.js'

export async function getItem(srl)
{
  const { data, message } = await request(`/app/${srl}/`, {
    query: { field: 'srl,name' },
  })
  if (!data) throw new Error(message)
  return data
}

export async function submit(srl)
{
  await request(`/app/${srl}/`, {
    method: 'delete',
  })
}
