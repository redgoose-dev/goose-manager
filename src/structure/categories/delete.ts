import { get, post } from '../../libs/api'

export async function submit(srl: number): Promise<void>
{
  const { success, message } = await post(`/categories/${srl}/delete/`)
  if (!success) throw new Error(message)
}

export async function getItem(srl: number): Promise<any>
{
  let res = await get(`/categories/${srl}/`, {
    field: 'srl,name',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}
