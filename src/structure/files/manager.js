import { get, post, formData } from '../../libs/api';

/** @var {string} API_URL */

/**
 * filtering item for global
 * @param {object} src
 * @return {object}
 */
function filteringItemGlobal(src)
{
  return {
    name: src.name,
    path: src.path,
    pathFull: API_URL + '/' + src.path,
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
 * filtering item for post
 * @param {object} src
 * @return {object}
 */
function filteringItemPost(src)
{
  return {
    srl: src.srl,
    name: src.name,
    path: src.path,
    pathFull: API_URL + '/' + src.path,
    size: src.size,
    type: src.type,
    badge: [],
    context: [
      'open-new-window',
      'insert',
      'insert-html',
      'insert-address',
      'set-thumbnail',
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
  return res.data.index.map(item => filteringItemGlobal(item));
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
  let res = await post('/files/upload-file/', formData({ sub_dir: path, file }), {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress(progressEvent)
    {
      if (func && typeof func === 'function') func(progressEvent);
    },
  });
  if (!res.success) throw new Error(res.message);
  return filteringItemGlobal(res.data);
}
/**
 * remove files global
 * @param {[object]} src
 * @return {Promise<[number|string]>}
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
 * @param {string} module
 * @param {number} srl
 * @return {Promise<object[]>}
 */
export async function getItemsPost(module, srl)
{
  if (!(module && srl)) throw new Error('no module or srl');
  let res = await get('/files/', {
    order: 'srl',
    sort: 'asc',
    unlimit: 1,
    module,
    target: srl,
  });
  if (!res.success) throw new Error(res.message);
  return res.data.index.map(item => filteringItemPost(item));
}
/**
 * upload file form post
 */
export async function uploadFilePost(file, module, srl, func)
{
  if (!(file && module && srl)) throw new Error('no file or module or srl');
  let res = await post(`/files/`, formData({
    module,
    target_srl: srl,
    file,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress(progressEvent)
    {
      if (func && typeof func === 'function') func(progressEvent);
    },
  });
  if (!res.success) throw new Error(res.message);
  return filteringItemPost(res.data);
}
/**
 * remove files post
 * @param {object[]} src
 * @return {Promise<[number|string]>}
 */
export async function removeFilesPost(src)
{
  if (src.length <= 0) throw new Error('no item');
  let res = await Promise.all(src.map(item => {
    return post(`/files/${item.srl}/delete/`);
  }));
  return res.map((res, key) => {
    return res.success ? src[key].key : res.message;
  });
}
