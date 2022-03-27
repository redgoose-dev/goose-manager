import { get, post, formData } from '../../libs/api';
import { defaultContent, checkTime } from './lib';
import store from '../../store';

/**
 * filtering item
 * @param {object} src
 * @return {{srl: number, content: string, date: string, percent: number}}
 */
function filteringItem(src)
{
  return {
    srl: src.srl,
    content: src.content,
    date: src.regdate,
    percent: src.percent,
  };
}

/**
 * filtering files
 * @param {object[]} src
 * @return {object[]}
 */
function filteringFiles(src)
{
  if (!src) return [];
  return src.map(o => {
    return {
      name: o.name,
      path: o.path,
      size: o.size,
    };
  });
}

/**
 * get last item
 * @return {Promise<object>}
 */
export async function getLastItem()
{
  const { preference } = store.state;
  let result, files;
  let params = { order: 'srl', sort: 'desc', size: 1 };
  let res = await get(`/checklist/`, params);
  let item = res.data?.index[0];
  if (!item || (!!item && checkTime(item.regdate, preference.checklist.resetTime)))
  {
    // add item
    res = await post('/checklist/?return=1', formData({
      content: (item?.content) ? item.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
    }));
    if (!res?.data) throw new Error('Not found add data.');
    result = res.data;
  }
  else
  {
    result = item;
  }
  // get files
  try
  {
    res = await get(`/files/`, {
      module: 'checklist',
      target: result.srl,
      unlimit: 1,
    });
    files = filteringFiles(res.data?.index);
  }
  catch (e)
  {}
  return {
    ...filteringItem(result),
    files,
  };
}

/**
 * get item
 * @param {number} srl
 * @return {Promise<object>}
 */
export async function getItem(srl)
{
  if (!srl) throw new Error('no srl');
  let [ items, files ] = await Promise.all([
    get(`/checklist/${srl}/`),
    get('/files/', {
      module: 'checklist',
      target: srl,
      unlimit: 1,
    }),
  ]);
  if (!items.success) throw new Error(items.message);
  return {
    ...filteringItem(items.data),
    files: filteringFiles(files.data?.index),
  };
}

/**
 * edit item
 * @param {number} srl
 * @param {string} content
 * @return {Promise<void>}
 * @throws {Error}
 * */
export async function editItem(srl, content)
{
  if (!srl) throw new Error('no srl');
  if (!content) throw new Error('no content');
  let res = await post(`/checklist/${srl}/edit/`, formData({
    content,
  }));
  if (!res.success) throw new Error(res.message);
}
