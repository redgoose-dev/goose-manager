import { get } from '../../libs/api';

const defaultOptions = {
  url: null,
  params: {},
};

async function request(op)
{
  return await get(op.url, op.params);
}

function filtering(res)
{
  return {
    srl: Number(res.srl),
    name: res.name,
    description: res.description,
    json: JSON.stringify(res.json, null, 2),
    regdate: res.regdate,
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
