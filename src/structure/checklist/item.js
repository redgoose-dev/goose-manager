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
 * get last item
 * @return {Promise<object>}
 */
export async function getLastItem()
{
  const { preference } = store.state;
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
    return filteringItem(res.data);
  }
  else
  {
    return filteringItem(item);
  }
}

/**
 * get item
 * @param {number} srl
 * @return {Promise<object>}
 */
export async function getItem(srl)
{
  return {};
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
