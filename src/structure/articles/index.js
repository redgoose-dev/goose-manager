import { useRoute } from 'vue-router';
import { get } from '../../libs/api';
import { getDate } from '../../libs/date';
import { getTypeLabelArticle } from '../../components/pages/articles/libs';

let route;

async function requestNest()
{
  if (!route.params.nestSrl) return null;
  let res = await get(`/nests/${route.params.nestSrl}/`, {
    field: 'srl,id,description',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

async function requestArticles()
{
  const { category, page, visibleType } = route.query;
  let res = await get('/articles/', {
    nest: route.params.nestSrl || undefined,
    category: category || undefined,
    field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
    size: 20,
    ext_field: 'category_name',
    visible_type: visibleType || 'all',
    page: Number(route.query.page) > 1 ? Number(route.query.page) : undefined,
    // order: '', // TODO
    q: route.query.q || undefined,
  });
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
          item.category_name && item.category_name,
          `Hit:${item.hit}`,
        ].filter(Boolean),
        image: '', // TODO: 썸네일 이미지 주소
      };
    }),
  };
}

async function requestCategories()
{
  if (!route.params.nestSrl) return null;
  const { category, visibleType } = route.query;
  let res = await get(`/categories/`, {
    nest: route.params.nestSrl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    ext_field: 'count_article,item_all,none',
    visible_type: visibleType || 'all',
    strict: 1,
  });
  if (!res.success) throw new Error(res.message);
  return res.data?.index.map(item => {
    let link, active;
    switch (item.srl)
    {
      case '':
        link = '';
        active = !category;
        break;
      case 'null':
        link = '?category=null';
        active = category === 'null';
        break;
      default:
        link = item.srl ? `?category=${item.srl}` : '';
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
export default async function getData()
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
