import { request } from '@/libs/api.js'

export async function getData(id)
{
  const value = Number(id)
  if (!Number.isSafeInteger(value) || value < 1) throw new Error('Invalid log id.')
  const res = await request(`/log/${value}/`)
  if (!res?.data) throw new Error(res?.message || 'No log data.')
  return res.data
}
