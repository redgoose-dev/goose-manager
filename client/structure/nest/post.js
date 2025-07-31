import { preferenceStore } from '../../store/app.js'
import { request, formData } from '../../libs/api.js'

function filteringApp(src)
{
  if (!(src?.index?.length > 0)) throw new Error('Not found App data')
  return src.index.map(o => {
    return {
      label: `[${o.code}] ${o.name}`,
      value: o.srl,
    }
  })
}

export function getJSON(src = {})
{
  const preference = preferenceStore()
  return {
    useCategory: src.useCategory || '0',
    useComment: src.useComment || '0',
    thumbnail: {
      width: Number(src.thumbnail?.width || 640),
      height: Number(src.thumbnail?.height || 480),
      type: src.thumbnail?.type || 'crop',
    },
    files: {
      count: Number(src.files?.count || preference.nest.uploadFileCount),
      sizeSingle: Number(src.files?.sizeSingle || preference.nest.limitUploadFile),
    },
  }
}

export async function getData(mode, srl)
{
  if (!mode) return { app: [], nest: undefined }
  const { app, nest } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'app',
        url: '/app/',
        params: {
          fields: 'srl,code,name',
          unlimited: '1',
        },
      },
      mode === 'edit' && {
        key: 'nest',
        url: `/nest/{srl}/`,
        params: { srl },
      },
    ].filter(Boolean),
  })
  return {
    app: filteringApp(app?.data),
    nest: nest?.data,
  }
}

export async function submit(srl, data)
{
  const url = srl ? `/nest/${srl}/` : '/nest/'
  await request(url, {
    method: srl ? 'patch' : 'put',
    body: formData(data),
  })
}
