import { get, post } from '../../libs/api';

export async function submit(srl: number): Promise<void>
{
  let res = await post(`/articles/${srl}/delete/`)
  if (!res.success) throw new Error(res.message)
}

export async function getItem(srl: number): Promise<any>
{
  let res = await get(`/articles/${srl}/`, {
    field: 'srl,title',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}
