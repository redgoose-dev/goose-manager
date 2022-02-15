import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

const defaultOptions = {
  url: '/apps/',
  params: {},
};

async function request(op)
{
  return await get(op.url, op.params);
}

function filtering(res)
{
  return {
    total: res.total,
    index: res.index.map(item => {
      const regdate = getDate(item.regdate);
      return {
        srl: item.srl,
        title: item.name,
        description: item.description,
        regdate,
        meta: [
          `srl: ${item.srl}`,
          `id: ${item.id}`,
          `date: ${regdate}`,
        ],
      };
    }),
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
