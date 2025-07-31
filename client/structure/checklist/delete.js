import { request } from '../../libs/api.js'
import { dateFormat } from '../../libs/date.js'

function filtering(src)
{
  return {
    srl: src.srl,
    name: dateFormat(new Date(src.created_at), '{yyyy}-{MM}-{dd} ({week})'),
  }
}

export async function getData(srl)
{
  const { data, message } = await request(`/checklist/${srl}/`)
  if (!data) throw new Error(message)
  return filtering(data)
}

export async function submit(srl)
{
  await request(`/checklist/${srl}/`, {
    method: 'delete',
  })
}
