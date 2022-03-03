import { get, post, checkForms } from '../../libs/api';

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

/**
 * create comment
 * @param {number} articleSrl
 * @param {object} forms
 * @return {Promise<number>}
 */
export async function createComment(articleSrl, forms)
{
  checkForms(forms);
  let res = await post('/comments/', {
    article_srl: articleSrl,
    content: forms.content.value,
    get: 1,
  });
  if (!res.success) throw new Error(res.message);
  res = await get(`/comments/${res.srl}/`, {
    ext_field: 'user_name',
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

/**
 * edit comment
 * @param {number} srl
 * @param {string} content
 * @return {Promise<void>}
 * @throws {Error}
 */
export async function editComment(srl, content)
{
  let res = await post(`/comments/${srl}/edit/`, { content });
  if (!res.success) throw new Error(res.message);
}

/**
 * delete comment
 * @param {number} srl
 * @return {Promise<void>}
 * @throws {Error}
 */
export async function deleteComment(srl)
{
  let res = await post(`/comments/${srl}/delete/`);
  if (!res.success) throw new Error(res.message);
}
