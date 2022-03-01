import { get, post } from '../../libs/api';

/**
 * submit
 * @param {number} srl
 */
export async function submit(srl)
{
  let res = await post(`/users/${srl}/delete/`);
  if (!res.success) throw new Error(res.message);
}

/**
 * get item
 * @param {number} srl
 */
export async function getItem(srl)
{
  let res = await get(`/users/${srl}/`, {
    field: 'srl,name,email',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
