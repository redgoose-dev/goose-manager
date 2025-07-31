import { request, checkForms, formData } from '../../libs/api.js'

function filteringData(src)
{
  return {
    srl: src.srl,
    code: src.code,
    name: src.name,
    description: src.description,
  }
}

export async function getData(srl)
{
  const { data } = await request(`/app/${srl}/`)
  if (!data) throw new Error('데이터가 없습니다.')
  return filteringData(data)
}

export async function submit(srl, forms)
{
  checkForms(forms)
  const url = srl ? `/app/${srl}/` : '/app/'
  await request(url, {
    method: srl ? 'patch' : 'put',
    body: formData({
      code: forms.code.value,
      name: forms.name.value,
      description: forms.description.value,
    }),
  })
}
