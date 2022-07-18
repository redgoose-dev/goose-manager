import { post, formData } from '../../libs/api'
import { getLastItem, getItem } from './item'

export async function getData(srl: number = NaN): Promise<any>
{
  let res;
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

export async function submit(srl: number, content: string): Promise<void>
{
  let res = await post(`/checklist/${srl}/edit/`, formData({ content }));
  if (!res.success) throw new Error(res.message);
}
