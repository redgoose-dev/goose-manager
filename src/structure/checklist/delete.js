import { get, post } from '../../libs/api'

export async function getData(srl)
{
  if (!srl) throw new Error('no srl')
  let res = await get(`/checklist/${srl}/`)
  if (!res.success) throw new Error(res.message)
  return res.data
}

export async function deleteItem(srl)
{
  if (!srl) throw new Error('no srl')
  let res = await post(`/checklist/${srl}/delete/`)
  if (!res.success) throw new Error(res.message)
}
