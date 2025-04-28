import { post, formData } from '../../libs/api'
import { getLastItem, getItem } from './item'

export async function getData(srl = NaN)
{
  let res
  if (srl)
  {
    res = await getItem(srl)
  }
  else
  {
    res = await getLastItem()
  }
  return {
    srl: res.srl,
    content: res.content,
    date: res.date,
  }
}

export async function submit(srl, content)
{
  let res = await post(`/checklist/${srl}/edit/`, formData({ content }))
  if (!res.success) throw new Error(res.message)
}
