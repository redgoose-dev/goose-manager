import { request } from '../../libs/api.js'

function filtering({ json, category, tag, file })
{
  return {
    srl: json.srl,
    name: json.name,
    description: json.description,
    json: json.json,
    date: json.created_at,
    category: category?.name || '',
    tag: tag?.index?.length > 0 ? tag.index : [],
    file: file?.index?.length > 0 ? file.index : [],
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
        params: { srl: srl },
      },
      {
        key: 'category',
        url: '/category/{srl}/',
        params: { srl: '{{json.data.category_srl}}' }
      },
      {
        key: 'tag',
        url: '/tag/',
        params: {
          module: 'json',
          module_srl: '{{json.data.srl}}',
        }
      },
      {
        key: 'file',
        url: '/file/',
        params: {
          module: 'json',
          module_srl: '{{json.data.srl}}',
          fields: 'srl,code,name,mime,size,json,created_at',
        },
      },
    ],
  })
  if (!res?.json?.data) throw new Error(res?.json?.message || 'No JSON data.')
  return filtering({
    json: res.json.data,
    category: res.category?.data,
    tag: res.tag?.data,
    file: res.file?.data,
  })
}
