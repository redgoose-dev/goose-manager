import { request } from '@/libs/api.js'

function filtering({ json, category, tag })
{
  return {
    srl: json.srl,
    name: json.name,
    description: json.description,
    json: json.json,
    date: json.created_at,
    category: category?.name || '',
    categorySrl: category?.srl || null,
    tag: tag?.index?.length > 0 ? tag.index : [],
    countFile: json.count_file || 0,
  }
}

export async function getData(srl)
{
  const res = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'json',
        url: '/json/{srl}/',
        params: {
          srl,
          mod: 'count-file',
        },
      },
      {
        key: 'category',
        url: '/category/{srl}/',
        params: { srl: '{{json.category_srl}}' }
      },
      {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'json',
          module_srl: '{{json.srl}}',
        }
      },
    ],
  })
  if (!res?.json) throw new Error(res?.json?.message || 'No JSON data.')
  return filtering({
    json: res.json,
    category: res.category,
    tag: res.tag,
  })
}
