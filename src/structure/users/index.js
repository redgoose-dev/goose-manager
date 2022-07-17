import store from '../../store-legacy';
import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

const defaultOptions = {
  url: '/users/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
};

async function request(op)
{
  return await get(op.url, op.params);
}

function filtering(res)
{
  return {
    total: res.total,
    index: res.index.map(item => ({
      srl: item.srl,
      title: item.email,
      meta: [
        `srl: ${item.srl}`,
        `name: ${item.name}`,
        getDate(item.regdate),
        item.admin && `Admin`,
      ].filter(Boolean),
      self: store.state.user.srl === Number(item.srl),
    })),
  };
}

/**
 * get data
 * @param {object} options
 * @return {Promise<array|object>}
 * @throws {Error}
 */
export default async function getData(options = {})
{
  let op = Object.assign({}, defaultOptions, options);
  if (options.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params);
  }
  let res = await request(op);
  return filtering(res.data);
}
