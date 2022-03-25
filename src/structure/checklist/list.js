import { useRoute } from 'vue-router';
import store from '../../store';
import { get } from '../../libs/api';
import { dateFormat, setDate } from '../../libs/date';
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
  let params = {
    field: 'srl,percent,regdate',
    order: 'srl',
    size: checklist.pageCount,
    page: Number(route.query.page || 1),
    sort: checklist.filter.sort,
  };
  if (checklist.filter.dateStart && checklist.filter.dateEnd)
  {
    params.start = checklist.filter.dateStart;
    params.end = checklist.filter.dateEnd;
  }
  if (checklist.filter.keyword) params.q = checklist.filter.keyword;
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
