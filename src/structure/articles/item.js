import { marked } from 'marked';
import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

async function requestArticle(srl)
{
  let res = await get(`/articles/${srl}/`, {
    ext_field: 'category_name',
  });
  if (!res.success) throw new Error(res.message);
  return {
    srl: res.data.srl,
    nestSrl: res.data.nest_srl,
    title: res.data.title,
    type: res.data.type,
    content: marked(res.data.content),
    categoryName: res.data.category_name,
    hit: res.data.hit,
    star: res.data.star,
    json: res.data.json,
    regdate: getDate(res.data.regdate),
    order: res.data.order,
  };
}

async function requestNest(srl)
{
  let res = await get(`/nests/${srl}/`);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

async function requestFiles(articleSrl)
{
  let res = await get('/files/', {
    module: 'articles',
    target: articleSrl,
    unlimit: 1,
  });
  if (!res.success) throw new Error(res.message);
  return res.data.index.map(item => {
    return {
      ...item,
    };
  });
}

/**
 * get data
 * @param {number} srl
 * @return {Promise<object>}
 * @throws {Error}
 */
export default async function getData(srl)
{
  let article = await requestArticle(srl);
  let [ nest, files ] = await Promise.all([
    requestNest(article.nestSrl),
    requestFiles(article.srl),
  ]);
  return {
    article,
    nest,
    files,
  };
}
