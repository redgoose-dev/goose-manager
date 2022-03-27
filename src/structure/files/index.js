import { useRoute } from 'vue-router';
import store from '../../store';
import { get } from '../../libs/api';
import { createFullPath } from './util';
import { getByte } from '../../libs/string';
import { getDate } from '../../libs/date';

let route;

/**
 * get items
 */
export async function getItems()
{
  route = useRoute();
  const { page } = route.query;
  const { pagePerSize } = store.state.preference.files;
  let res = await get('/files/', {
    order: 'srl',
    sort: 'desc',
    size: pagePerSize,
    page: Number(page) > 1 ? Number(page) : undefined,
  });
  if (!res.success) throw new Error(res.message);
  return {
    total: res.data.total,
    index: res.data.index.map(item => ({
      srl: item.srl,
      title: item.name,
      href: createFullPath(item.path),
      image: /^image/.test(item.type) ? createFullPath(item.path) : null,
      meta: [
        item.type,
        `Size: ${getByte(item.size)}`,
        `Date: ${getDate(item.regdate)}`,
        `Module: ${item.module}`,
        `srl: ${item.target_srl}`,
      ].filter(Boolean),
    })),
  };
}
