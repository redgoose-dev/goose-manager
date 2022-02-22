import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

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
  return res.data?.index || [];
}
function filteringCategories(src)
{
  return src.map(item => {
    return {
      srl: item.srl,
      title: item.name,
      meta: [ getDate(item.regdate) ],
    };
  });
}

/**
 * get data
 * @param {number} srl nest srl
 * @return {Promise<array>}
 * @throws {Error}
 */
export default async function getData(srl)
{
  // TODO: 아무래도 nest-id도 가져와야할거같어..
  if (!srl) throw new Error('no srl');
  let categories = await requestCategories(srl);
  return filteringCategories(categories);
}
