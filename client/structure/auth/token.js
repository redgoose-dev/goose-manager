import { request, formData } from '../../libs/api.js'
import { authProviderLabel } from '../../libs/assets.js'
import { dateFormat } from '../../libs/date.js'

function filtering(src)
{
  return {
    srl: src.srl,
    providerSrl: src.provider_srl,
    accessToken: src.access,
    description: src.description,
    provider: authProviderLabel[src.provider?.code],
    regdate: dateFormat(new Date(src.created_at), '{yyyy}-{MM}-{dd}'),
  }
}

export async function getIndex()
{
  const res = await request('/auth/token/', {
    query: { mod: 'provider' },
  })
  if (!(res?.data?.index?.length > 0)) return []
  return res.data.index.map(o => filtering(o))
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
