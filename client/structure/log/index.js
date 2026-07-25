import { request } from '@/libs/api.js'

const DEFAULT_SIZE = 50

function getQueryValue(value)
{
  if (Array.isArray(value)) return value[0]
  return value || undefined
}

export async function getData(query = {}, options = {})
{
  const res = await request('/log/', {
    query: {
      cursor: options.cursor || undefined,
      size: options.size || DEFAULT_SIZE,
      total: options.total === false ? undefined : 1,
      level: getQueryValue(query.level),
      from: getQueryValue(query.from),
      to: getQueryValue(query.to),
      status: getQueryValue(query.status),
      method: getQueryValue(query.method),
      path: getQueryValue(query.path),
      request_id: getQueryValue(query.request_id),
      q: getQueryValue(query.q),
    },
  })
  const data = res?.data
  return {
    index: Array.isArray(data?.index) ? data.index : [],
    total: Number.isFinite(Number(data?.total)) ? Number(data.total) : null,
    assets: {
      hasNext: Boolean(data?.assets?.has_next),
      cursor: data?.assets?.cursor || null,
    },
  }
}
