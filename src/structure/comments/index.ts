import { get, post, checkForms } from '../../libs/api'

export async function getComments(articleSrl: number): Promise<any>
{
  const { success, message, data } = await get('/comments/', {
    article: articleSrl,
    ext_field: 'user_name',
    unlimit: 1,
  })
  if (!success) throw new Error(message)
  return data?.index || []
}

export async function createComment(articleSrl: number, forms: any): Promise<any>
{
  checkForms(forms)
  let res: any = await post('/comments/', {
    article_srl: articleSrl,
    content: forms.content.value,
    get: 1,
  })
  if (!res.success) throw new Error(res.message)
  res = await get(`/comments/${res.srl}/`, {
    ext_field: 'user_name',
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}

export async function editComment(srl: number, content: string): Promise<void>
{
  const { success, message } = await post(`/comments/${srl}/edit/`, { content });
  if (!success) throw new Error(message);
}

export async function deleteComment(srl: number): Promise<void>
{
  const { success, message } = await post(`/comments/${srl}/delete/`);
  if (!success) throw new Error(message);
}
