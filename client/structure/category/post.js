import { request, checkForms, formData } from '../../libs/api.js'

function filteringData(src)
{
  return {
    srl: src.srl,
    name: src.name,
  }
}

export async function getData(srl)
{
  const { data } = await request(`/category/${srl}/`)
  if (!data) throw new Error('데이터가 없습니다.')
  return filteringData(data)
}

export async function submit(srl, forms)
{
  checkForms(forms)
  const url = srl ? `/category/${srl}/` : '/category/'
  let data = {
    name: forms.name.value,
  }
  if (!srl)
  {
    data['module'] = forms.module.value
    if (forms.moduleSrl.value) data['module_srl'] = forms.moduleSrl.value
  }
  await request(url, {
    method: srl ? 'patch' : 'put',
    body: formData(data),
  })
}
