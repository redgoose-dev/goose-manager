import { dateStore } from '@/store/app.js'
import { request, formData } from '@/libs/api.js'
import { authProviderLabel } from '@/libs/assets.js'

export async function getIndex()
{
  const res = await request('/auth/token/', {
    query: {
      order: 'srl DESC',
      mod: 'provider',
    },
  })
  if (!(res?.data?.index?.length > 0)) return []
  const date = dateStore()
  return res.data.index.map(o => {
    return {
      srl: o.srl,
      providerSrl: o.provider_srl,
      accessToken: o.access,
      description: o.description,
      provider: authProviderLabel[o.provider?.code],
      regdate: date.format(o.created_at, 'full'),
    }
  })
}

export async function createToken(data)
{
  await request('/auth/token/', {
    method: 'put',
    body: formData(data),
  })
}

export async function editToken(srl, data)
{
  await request(`/auth/token/${srl}/`, {
    method: 'patch',
    body: formData(data),
  })
}

export async function deleteToken(srl)
{
  await request(`/auth/token/${srl}/`, {
    method: 'delete',
  })
}
