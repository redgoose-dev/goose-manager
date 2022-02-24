import { get } from '../../libs/api';

/**
 * request nest
 * @param {number} nestSrl
 * @return {Promise<object>}
 * @throws {Error}
 */
async function requestNest(nestSrl)
{
  let res = await get(`/nests/${nestSrl}/`);
  return res.success ? res.data : null;
}

/**
 * request nest
 * @param {number} nestSrl
 * @return {Promise<array>}
 * @throws {Error}
 */
async function requestCategories(nestSrl)
{
  let res = await get(`/categories/`, {
    nest: nestSrl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    strict: 1,
  });
  return res.data?.index?.length > 0 ? res.data?.index.map(item => {
    return {
      label: item.name,
      value: item.srl,
    };
  }) : [];
}

/**
 * request nest
 * @param {number} articleSrl
 * @return {Promise<object>}
 * @throws {Error}
 */
async function requestArticle(articleSrl)
{
  // TODO: 데이터가 생기면 작업하기
  return {};
}

/**
 * get data
 * @param {number} nestSrl
 * @param {number} articleSrl
 * @return {Promise<{nest:{}, categories:object[], article:{}}>}
 * @throws {Error}
 */
export default async function getData(nestSrl, articleSrl)
{
  let [ nest, categories, article ] = await Promise.all([
    requestNest(nestSrl),
    requestCategories(nestSrl),
    !!articleSrl && requestArticle(articleSrl),
  ].filter(Boolean));
  return {
    nest,
    categories,
    article,
  };
}
