import { get, post, formData } from '../../libs/api';
import { getLastItem, getItem } from './item';

/**
 * get data
 * @param {number} srl
 * @return {Promise<{srl, content, date}>}
 */
export async function getData(srl = NaN)
{
  let res;
  if (srl)
  {
    res = await getItem(srl);
  }
  else
  {
    res = await getLastItem();
  }
  return {
    srl: res.srl,
    content: res.content,
    date: res.date,
  };
}

/**
 * submit
 * @param {number} srl
 * @param {string} content
 * @return {Promise<void>}
 */
export async function submit(srl, content)
{
  let res = await post(`/checklist/${srl}/edit/`, formData({ content }));
  if (!res.success) throw new Error(res.message);
}
