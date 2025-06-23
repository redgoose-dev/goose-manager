import { request, formData, checkForms } from '../../libs/api.js'
import { checkingJSON } from '../../libs/object.js'

function filteringJSON(src)
{
  if (!src?.data) return null
  const { data } = src
  return {
    ...data,
    json: JSON.stringify(data.json),
    tag: data.tag?.length > 0 ? data.tag.map(o => (o.name)).join(',') : '',
  }
}
function filteringCategory(src)
{
  if (!(src.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    return {
      value: o.srl,
      label: o.name,
    }
  })
}

export async function getData(mode, srl)
{
  if (!mode) return { app: [], nest: undefined }
  const { json, category } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'category',
        url: '/category/',
        params: {
          module: 'json',
          fields: 'srl,name',
          order: 'turn',
          sort: 'asc',
          unlimited: '1',
        },
      },
      mode === 'edit' && {
        key: 'json',
        url: '/json/{srl}/',
        params: {
          srl,
          mod: 'tag',
        },
      }
    ].filter(Boolean),
  })
  return {
    json: filteringJSON(json),
    category: filteringCategory(category),
  }
}

export async function submit(srl, forms)
{
  checkForms(forms)
  checkingJSON(forms.json.value)
  const url = srl ? `/json/${srl}/` : '/json/'
  const { data } = await request(url, {
    method: srl ? 'patch' : 'put',
    body: formData({
      name: forms.name.value,
      description: forms.description.value,
      json: forms.json.value,
      category: forms.category.value || '0',
      tag: forms.tag.value || '',
    }),
  })
  return data || srl
}
