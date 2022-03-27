import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

/**
 * request nest
 * @param {number} nestSrl
 * @return {Promise<object>}
 */
async function requestNest(nestSrl)
{
  let res = await get(`/nests/${nestSrl}/`, {
    field: 'srl,id,name',
  });
  if (!res.success) throw new Error(res.message);
  return {
    srl: res.data.srl,
    id: res.data.id,
    name: res.data.name,
  };
}

/**
 * request categories
 * @param {number} nestSrl
 * @return {Promise<array>}
 */
async function requestCategories(nestSrl)
{
  let res = await get('/categories/', {
    nest: nestSrl,
    order: 'turn',
    sort: 'asc',
  });
  if (!res.success) throw new Error(res.message);
  return res.data.index.map(item => {
    return {
      srl: item.srl,
      title: item.name,
      meta: [
        getDate(item.regdate),
      ],
    };
  });
}

/**
 * get data
 * @param {number} srl nest srl
 * @return {Promise<{nest,categories}>}
 * @throws {Error}
 */
export default async function getData(srl)
{
  if (!srl) throw new Error('no srl');
  const [ nest, categories ] = await Promise.all([
    requestNest(srl),
    requestCategories(srl),
  ]);
  return { nest, categories };
}
