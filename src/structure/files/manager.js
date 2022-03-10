import { get, post, formData } from '../../libs/api';

/**
 * filtering item
 * @param {object} src
 * @return {object}
 */
function filteringItem(src)
{
  return {
    name: src.name,
    path: src.path,
    pathFull: src.pathFull,
    size: src.size,
    type: src.type,
    badge: [],
    context: [
      'open-new-window',
      'insert',
      'insert-html',
      'insert-address',
      'delete',
    ],
  };
}

/**
 * get items form global
 * @param {string} path
 * @return {Promise<Array>}
 */
export async function getItemsGlobal(path)
{
  if (!path) throw new Error('no path');
  let res = await get(`/files/get-files/${path}/`, {
    order: 'date',
    sort: 'desc',
  });
  if (!res.success) throw new Error(res.message);
  return res.data.index.map(item => filteringItem(item));
}
/**
 * upload file form global
 * @param {File} file
 * @param {string} path
 * @param {function} func progress tick
 * @return {Promise<object>}
 */
export async function uploadFileGlobal(file, path, func)
{
  if (!file || !path) throw new Error('no file or path');
  let res = await post(
    '/files/upload-file/',
    formData({ sub_dir: path, file }),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress(progressEvent)
      {
        if (func && typeof func === 'function') func(progressEvent);
      },
    }
  );
  if (!res.success) throw new Error(res.message);
  return filteringItem(res.data);
}
/**
 * remove files global
 * @param {[object]} src
 * @return {Promise<array>}
 */
export async function removeFilesGlobal(src)
{
  if (src.length <= 0) throw new Error('no path');
  let res = await Promise.all(src.map(item => {
    return post('/files/remove-file/', formData({ path: item.path }));
  }));
  return res.map((res, key) => {
    return res.success ? src[key].key : res.message;
  });
}

/**
 * get items form post
 */
export async function getItemsPost()
{
  //
}
/**
 * upload file form post
 */
export async function uploadFilePost()
{
  //
}
