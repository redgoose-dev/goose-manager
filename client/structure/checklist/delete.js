import { request } from '@/libs/api.js'
import { dateStore } from '@/store/app.js'

export async function getData(srl)
{
  const date = dateStore()
  const { data, message } = await request(`/checklist/${srl}/`)
  if (!data) throw new Error(message)
  return {
    srl: data.srl,
    created_at: data.created_at,
  }
}

export async function submit(srl)
{
  await request(`/checklist/${srl}/`, {
    method: 'delete',
  })
}
