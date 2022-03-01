import { get, post } from '../../libs/api';

/**
 * submit
 * @param {number} srl
 */
export async function submit(srl)
{
  let res = await post(`/nests/${srl}/delete/`);
  if (!res.success) throw new Error(res.message);
}

/**
 * get item
 * @param {number} srl
 */
export async function getItem(srl)
{
  let res = await get(`/nests/${srl}/`, {
    field: 'srl,id,name',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
