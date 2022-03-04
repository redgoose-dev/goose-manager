import { useRoute } from 'vue-router';
import { get } from '../../libs/api';
import { getDate } from '../../libs/date';
import { serialize } from '../../libs/string';
import store from '../../store';

let route;

/**
 * set order
 * @param {string} order
 * @param {string} sort
 * @return {string}
 */
export function setOrder(order='srl', sort='desc')
{
  switch (order)
  {
    case 'order':
      return `\`order\` ${sort}, \`srl\` ${sort}`;
    case 'srl':
    default:
      return `\`srl\` ${sort}`;
  }
}

async function requestNest()
{
  if (!route.params.nestSrl) return null;
  let res = await get(`/nests/${route.params.nestSrl}/`, {
    field: 'srl,id,description',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function requestArticles()
{
  const { nestSrl } = route.params;
  const { category, page } = route.query;
  const { displayDateField, pageCount, filter } = store.state.preference.articles;
  const { type, order, sort } = filter;
  let res = await get('/articles/', {
    nest: nestSrl || undefined,
    category: category || undefined,
    field: 'srl,type,title,hit,star,regdate,nest_srl,category_srl,json,`order`',
    size: pageCount || 24,
    ext_field: `category_name${!nestSrl ? ',nest_name' : ''}`,
    visible_type: type || 'all',
    page: Number(page) > 1 ? Number(page) : undefined,
    order: setOrder(order, sort),
    q: route.query.q || undefined,
  });
  if (!res.success) throw new Error(res.message);
  return {
    total: res.data.total,
    index: res.data.index.map(item => {
      let title = item.title;
      if (item.nest_id)
      {
        title = `[${item.nest_id}] ${item.title}`;
      }
      else if (!route.query.category && item.category_name)
      {
        title = `[${item.category_name}] ${item.title}`;
      }
      return {
        srl: item.srl,
        title,
        meta: [
          getDate(displayDateField === 'order' ? item.order : item.regdate),
          `Hit:${item.hit}`,
          `Star:${item.star}`,
        ].filter(Boolean),
        thumbnail: '', // TODO: 썸네일 이미지 주소
        private: item.type === 'private',
      };
    }),
  };
}

export async function requestCategories()
{
  if (!route.params.nestSrl) return null;
  const { category, q } = route.query;
  const { type } = store.state.preference.articles.filter;
  let res = await get(`/categories/`, {
    nest: route.params.nestSrl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    ext_field: 'count_article,item_all,none',
    visible_type: type || 'all',
    q: q || undefined,
    strict: 1,
  });
  if (!res.success) throw new Error(res.message);
  let params = {
    ...route.query,
    page: undefined,
    category: undefined,
  };
  return res.data?.index.map(item => {
    let link, active;
    switch (item.srl)
    {
      case '':
        link = serialize(params, true);
        active = !category;
        break;
      case 'null':
        params.category = 'null';
        link = serialize(params, true);
        active = category === 'null';
        break;
      default:
        params.category = item.srl;
        link = item.srl ? serialize(params, true) : '';
        active = Number(category) === item.srl;
        break;
    }
    return {
      link,
      label: item.name,
      count: item.count_article,
      active,
    };
  });
}

/**
 * get data
 * @return {Promise<object>}
 * @throws {Error}
 */
export async function getData()
{
  route = useRoute();
  let [ nest, articles, categories ] = await Promise.all([
    requestNest(),
    requestArticles(),
    requestCategories(),
  ]);
  return {
    total: articles.total,
    nest,
    articles: articles.index,
    categories,
  };
}
