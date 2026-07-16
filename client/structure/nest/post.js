import { preferenceStore } from '@/store/app.js'
import { request } from '@/libs/api.js'

export const EXTRA_TARGET_NEST_KEY = '__nest__'

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
    [EXTRA_TARGET_NEST_KEY]: src[EXTRA_TARGET_NEST_KEY] ?? 0,
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
    articleExtra: src.articleExtra?.length > 0 ? src.articleExtra : [],
  }
}

export async function getData(mode, srl)
{
  if (!mode) return { app: [], nest: undefined }
  const { app, nests, nest } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'app',
        url: '/app/',
        params: {
          field: 'srl,code,name',
          page: 0,
        },
      },
      {
        key: 'nests',
        url: '/nest/',
        params: {
          field: 'srl,code,name,description',
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
    app: filteringApp(app),
    nests: nests.index?.length > 0 ? nests.index : [],
    nest,
  }
}

export async function submit(srl, data)
{
  const url = srl ? `/nest/${srl}/` : '/nest/'
  await request(url, {
    method: srl ? 'patch' : 'put',
    body: data,
  })
}
