import { request } from '@/libs/api.js'

export async function editComment(srl, content)
{
  await request(`/comment/${srl}/`, {
    method: 'patch',
    body: {
      content,
    },
  })
}

export async function deleteComment(srl)
{
  await request(`/comment/${srl}/`, {
    method: 'delete',
  })
}
