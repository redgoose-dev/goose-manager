import { useRoute } from 'vue-router';
import store from '../../store';
import { get, post, formData } from '../../libs/api';
import { dateFormat } from '../../libs/date';

let route;

/**
 * get data
 * @return {Promise<{}>}
 */
export async function getData()
{
  route = useRoute();
  let params = {
    field: 'srl,percent,regdate',
    order: 'srl',
    size: store.state.preference.checklist.pageCount,
    page: Number(route.query.page || 1),
    sort: 'desc',
  };
  if (route.query.year && route.query.month)
  {
    // TODO: 날짜부분, 선택한월 첫번째 날부터 마지막 날까지..
    // let date = new Date(this.filter.year, this.filter.month - 1, 1);
    // params.start = dateFormat(date, '{yyyy}-{MM}-{dd}');
    // date = new Date(this.filter.year, this.filter.month, 0);
    // params.end = dateFormat(date, '{yyyy}-{MM}-{dd}');
  }
  if (route.query.q) params.q = route.query.q;
  let res = await get('/checklist/', params);
  if (!res.success) throw new Error(res.message);
  return {
    total: res.data.total,
    index: res.data.index.map(item => {
      const regdate = item.regdate.split(' ')[0].split('-').map(o => Number(o));
      const date = new Date(regdate[0], regdate[1] - 1, regdate[2]);
      return {
        ...item,
        title: dateFormat(date, store.state.preference.checklist.dateFormat),
      };
    }),
  };
}
