import { get, post } from '../../libs/api'

export async function submit(srl: number): Promise<any>
{
  let res = await post(`/nests/${srl}/delete/`)
  if (!res.success) throw new Error(res.message)
}

export async function getItem(srl: number): Promise<any>
{
  let res = await get(`/nests/${srl}/`, {
    field: 'srl,id,name',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}
