import { marked } from 'marked';
import store from '../../store';
import { createFullPath } from '../files/util';
import { get, post, formData } from '../../libs/api';

/**
 * get description
 * @param {string} content
 * @return {string}
 */
function getDescription(content)
{
  content = marked(content);
  content = content.replace(/(<([^>]+)>)/ig, '');
  content = content.replace(/\n/ig, '');
  content = content.substring(0, 75);
  return content;
}

/**
 * request article
 * @param {number} srl article srl
 * @return {Promise<object>}
 */
async function requestArticle(srl)
{
  const res = await get(`/articles/${srl}/`, {
    field: 'srl,app_srl,nest_srl,category_srl,title,content,json,regdate',
    ext_field: 'category_name,nest_name',
    visible_type: 'all',
  });
  if (!res.success) throw new Error(res.message);
  return {
    appSrl: res.data.app_srl,
    nestSrl: res.data.nest_srl,
    categorySrl: res.data.category_srl,
    title: res.data.title,
    description: getDescription(res.data.content),
    image: createFullPath(res.data.json.thumbnail?.path),
    meta: [
      res.data.nest_name || null,
      res.data.category_name || null,
      res.data.regdate,
    ].filter(Boolean),
  };
}

/**
 * request nests
 * @param {number} appSrl app srl
 * @return {Promise<object[]>}
 */
async function requestNests(appSrl)
{
  let params = {
    app: appSrl,
    field: 'srl,app_srl,user_srl,id,name,json',
    ext_field: 'app_name',
    unlimit: 1,
  };
  if (!store.state.user.admin) params.user = store.state.user.srl;
  const res = await get('/nests/', params);
  if (!res.success) throw new Error(res.message);
  return res.data.index.map(o => ({
    value: Number(o.srl),
    label: `[${o.id}] ${o.name}`,
  }));
}

/**
 * request categories
 * @param {string} srl category srl
 * @return {Promise<object[]>}
 */
export async function requestCategories(srl)
{
  let params = {
    nest: srl,
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    unlimit: 1,
  };
  const res = await get('/categories/', params);
  return res.data?.index.map(item => ({
    value: String(item.srl),
    label: item.name,
  }));
}

/**
 * get data
 * @param {number} srl article srl
 * @return {Promise<{article,nests,categories}>}
 */
export async function getData(srl)
{
  const article = await requestArticle(srl);
  const nests = await requestNests(article.appSrl);
  return {
    article,
    nests,
  };
}

/**
 * submit
 * @param {object} options
 * @return {Promise<void>}
 * @throws {Error}
 */
export async function submit({ srl, nestSrl, categorySrl })
{
  let res = await post(`/articles/${srl}/change-nest/`, formData({
    nest_srl: nestSrl,
    category_srl: categorySrl,
  }));
  if (!res.success) throw new Error(res.message);
}
