import { get } from '../../libs/api';

// TODO: create
// TODO: edit
// TODO: delete

/**
 * get comments index
 * @param {number} articleSrl
 * @return {Promise<array>}
 * @throws {Error}
 */
export async function getComments(articleSrl)
{
  let res = await get('/comments/', {
    article: articleSrl,
    ext_field: 'user_name',
    unlimit: 1,
  });
  if (!res.success) throw new Error(res.message);
  return res.data.index;
}
