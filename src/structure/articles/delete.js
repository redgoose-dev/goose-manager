import { get, post } from '../../libs/api';

/**
 * submit
 * @param {number} srl
 */
export async function submit(srl)
{
  let res = await post(`/articles/${srl}/delete/`);
  if (!res.success) throw new Error(res.message);
}

/**
 * get item
 * @param {number} srl
 */
export async function getItem(srl)
{
  let res = await get(`/articles/${srl}/`, {
    field: 'srl,title',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
