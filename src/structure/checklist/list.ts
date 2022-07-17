import { useRoute } from 'vue-router';
import store from '../../store-legacy';
import { get } from '../../libs/api';
import { dateFormat } from '../../libs/date';
import { checkTime } from './lib';

let route;

/**
 * get data
 * @return {Promise<{total, index}>}
 * @throws {Error}
 */
export async function getData()
{
  if (!route) route = useRoute();
  const { checklist } = store.state.preference;
  const filter = store.state.filters.checklist;
  let params = {
    field: 'srl,percent,regdate',
    order: 'srl',
    size: checklist.pageCount,
    page: Number(route.query.page || 1),
    sort: filter.sort,
  };
  if (filter.dateStart && filter.dateEnd)
  {
    params.start = filter.dateStart;
    params.end = filter.dateEnd;
  }
  if (filter.keyword) params.q = filter.keyword;
  let res = await get('/checklist/', params);
  if (!res.success) throw new Error(res.message);
  return {
    total: res.data.total,
    index: res.data.index.map(item => {
      const regdate = item.regdate.split(' ')[0].split('-').map(o => Number(o));
      const date = new Date(regdate[0], regdate[1] - 1, regdate[2]);
      return {
        ...item,
        title: dateFormat(date, checklist.dateFormat),
        today: !checkTime(item.regdate, checklist.resetTime),
      };
    }),
  };
}
