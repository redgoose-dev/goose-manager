import { get } from '../../libs/api';
import { getDate } from '../../libs/date';
import { getTypeLabelArticle } from '../../components/pages/articles/libs';

const defaultParams = {
  field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
  ext_field: 'category_name',
  visible_type: 'all',
};

async function requestArticles(op)
{
  let res = await get('/articles/', op);
  if (!res.success) throw new Error(res.message);
  return {
    total: res.data.total,
    index: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.title,
        meta: [
          getTypeLabelArticle(item.type),
          getDate(item.regdate),
          item.category_name,
          `Hit:${item.hit}`,
        ],
        image: '', // TODO: 썸네일 이미지 주소
      };
    }),
  };
}

async function requestCategories(srl)
{
  let res = await get(`/categories/`, {
    nest: srl,
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
 * get data
 * @param {number} nestSrl
 * @param {object} options
 * @return {Promise<object>}
 * @throws {Error}
 */
export default async function getData(nestSrl, options = {})
{
  options = Object.assign({}, defaultParams, options);
  let [ articles, categories ] = await Promise.all([
    requestArticles(options),
    requestCategories(nestSrl),
  ]);
  return {
    total: articles.total,
    articles: articles.index,
    categories,
  };
}
