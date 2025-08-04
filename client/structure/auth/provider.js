import { request, formData } from '../../libs/api.js'

function filtering(src)
{
  if (!src) return null
  let result = {
    code: src.code,
  }
  if (src.account?.srl)
  {
    const { srl, user_name, user_id, user_email, user_avatar, created_at } = src.account
    result.srl = srl
    result.name = user_name
    result.id = user_id
    result.email = user_email
    result.avatar = user_avatar
    result.regdate = created_at
  }
  return result
}

function filteringIndex(src)
{
  if (!(src?.index?.length > 0)) return null
  return src.index.map(o => filtering(o))
}

export async function getIndex(body)
{
  const res = await request('/auth/providers/', {
    query: body,
  })
  return filteringIndex(res.data)
}

export async function disconnect(srl)
{
  await request(`/auth/provider/${srl}/`, {
    method: 'delete',
  })
}

export async function getPasswordItem(srl)
{
  const res = await request(`/auth/provider/${srl}/`)
  if (!res?.data) return null
  return filtering({
    code: res.data.code,
    account: res.data,
  })
}

export async function create(data)
{
  await request('/auth/provider/', {
    method: 'put',
    body: formData(data),
  })
}

export async function edit(srl, data)
{
  await request(`/auth/provider/${srl}/`, {
    method: 'patch',
    body: formData(data),
  })
}
