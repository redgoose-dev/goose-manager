import { get, post } from '../../libs/api'

export async function submit(srl)
{
  const { success, message } = await post(`/apps/${srl}/delete/`)
  if (!success) throw new Error(message)
}

export async function getItem(srl)
{
  const { success, message, data } = await get(`/apps/${srl}/`, {
    field: 'srl,id,name',
  })
  if (!success) throw new Error(message)
  return data
}
