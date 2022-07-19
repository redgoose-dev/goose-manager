import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

interface Options {
  url: string
  params: {
    order: string
    sort: string
  }
}

interface Result {
  total: number
  index: {
    srl: number
    title: string
    description: string
    meta: string[]
  }[]
}

const defaultOptions: Options = {
  url: '/apps/',
  params: {
    order: 'srl',
    sort: 'desc',
  },
};

async function request(op: Options)
{
  return await get(op.url, op.params);
}

function filtering(res: any): Result
{
  return {
    total: res.total,
    index: res.index.map((item: any) => ({
      srl: item.srl,
      title: item.name,
      description: item.description,
      meta: [
        `srl: ${item.srl}`,
        `id: ${item.id}`,
        `date: ${getDate(item.regdate)}`,
      ],
    })),
  };
}

export default async function getData(options?: any): Promise<Result>
{
  let op: Options = Object.assign({}, defaultOptions, options);
  if (options?.params)
  {
    op.params = Object.assign({}, defaultOptions.params, options.params);
  }
  const { data }: any = await request(op);
  return filtering(data);
}
