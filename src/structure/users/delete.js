import { get, post } from '../../libs/api'

export async function submit(srl)
{
  let res = await post(`/users/${srl}/delete/`)
  if (!res.success) throw new Error(res.message)
}

export async function getItem(srl)
{
  let res = await get(`/users/${srl}/`, {
    field: 'srl,name,email',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}
