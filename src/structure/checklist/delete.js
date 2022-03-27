import { get, post } from '../../libs/api';

/**
 * get data
 * @param {number} srl
 * @return {Promise<object>}
 */
export async function getData(srl)
{
  if (!srl) throw new Error('no srl');
  let res = await get(`/checklist/${srl}/`);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

/**
 * delete item
 * @param {number} srl
 * @return {Promise<void>}
 */
export async function deleteItem(srl)
{
  if (!srl) throw new Error('no srl');
  let res = await post(`/checklist/${srl}/delete/`);
  if (!res.success) throw new Error(res.message);
}
