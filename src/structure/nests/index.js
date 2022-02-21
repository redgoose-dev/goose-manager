import { get } from '../../libs/api';
import { getDate } from '../../libs/date';

// apps data
async function requestApps()
{
  return await get('/apps/', {
    field: 'srl,id,name,description',
    ext_field: 'count_nests',
    unlimit: 1,
  });
}
function filteringApps(res)
{
  return res.map(item => ({
    srl: item.srl,
    title: `[${item.id}] ${item.name}(${Number(item.count_nest || 0)})`,
    description: item.description,
  }));
}

// nests data
async function requestNests()
{
  return await get(`/nests/`, {
    ext_field: 'count_articles',
    visible_type: 'all',
    unlimit: 1,
  });
}
function filteringNests(res)
{
  return res.map(item => {
    return {
      srl: item.srl,
      appSrl: item.app_srl,
      title: `${item.name}(${item.count_article || 0})`,
      meta: [
        getDate(item.regdate),
        `id: ${item.id}`,
      ],
      useCategory: !!item.json?.useCategory,
    };
  });
}

/**
 * get data
 * @return {Promise<array>}
 * @throws {Error}
 */
export default async function getData()
{
  // get apps
  let apps = await requestApps();
  if (apps.data?.total <= 0) return [];
  apps = filteringApps(apps.data.index);

  // get nests
  let nests = await requestNests();
  nests = (nests.data?.index.length > 0) ? filteringNests(nests.data.index) : [];

  // combine items
  return apps.map(app => {
    let item = Object.assign({}, app);
    item.nests = nests.filter((nest) => {
      return item.srl === nest.appSrl;
    });
    delete item.appSrl;
    return item;
  });
}
