import { request, formData } from '../../libs/api.js'

export async function editComment(srl, content)
{
  await request(`/comment/${srl}/`, {
    method: 'patch',
    body: formData({ content }),
  })
}

export async function deleteComment(srl)
{
  await request(`/comment/${srl}/`, {
    method: 'delete',
  })
}
