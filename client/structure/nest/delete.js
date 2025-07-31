import { request } from '../../libs/api.js'

export async function getData(srl)
{
  const { data, message } = await request(`/nest/${srl}/`, {
    query: { fields: 'srl,name' },
  })
  if (!data) throw new Error(message)
  return data
}

export async function submit(srl)
{
  await request(`/nest/${srl}/`, {
    method: 'delete',
  })
}
