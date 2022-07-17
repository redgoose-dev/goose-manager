import { get, post, formData } from '../../libs/api';
import { createFullPath } from './util';

function filteringItemGlobal(src: any): any
{
  return {
    name: src.name,
    path: src.path,
    pathFull: createFullPath(src.path),
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
function filteringItemPost(src: any): any
{
  return {
    srl: src.srl,
    name: src.name,
    path: src.path,
    pathFull: createFullPath(src.path),
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

export async function getItemsGlobal(path: string): Promise<any[]>
{
  if (!path) throw new Error('no path');
  const { success, message, data } = await get(`/files/get-files/${path}/`, {
    order: 'date',
    sort: 'desc',
  });
  if (!success) throw new Error(message);
  return data?.index.map((o: any) => filteringItemGlobal(o));
}
export async function uploadFileGlobal(file: File, path: string): Promise<{}>
{
  if (!file || !path) throw new Error('no file or path');
  let res = await post('/files/upload-file/', formData({ sub_dir: path, file }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.success) throw new Error(res.message);
  return filteringItemGlobal(res.data);
}
export async function removeFilesGlobal(src: any[]): Promise<(number|string)[]>
{
  if (src.length <= 0) throw new Error('no path');
  let res = await Promise.all(src.map((item: any) => {
    return post('/files/remove-file/', formData({ path: item.path }));
  }));
  return res.map((res, key: number) => {
    return res.success ? src[key].key : res.message;
  });
}

/**
 * get items form post
 * @param {string} module
 * @param {number} srl
 * @return {Promise<object[]>}
 */
export async function getItemsPost(module: string, srl: number): Promise<{}[]>
{
  if (!(module && srl)) throw new Error('no module or srl');
  const { success, message, data } = await get('/files/', {
    order: 'srl',
    sort: 'asc',
    unlimit: 1,
    module,
    target: srl,
  });
  if (!success) throw new Error(message);
  return data?.index.map((o: any) => filteringItemPost(o));
}
export async function uploadFilePost(file: File, module: string, srl: number): Promise<any>
{
  if (!(file && module && srl)) throw new Error('no file or module or srl');
  let res = await post(`/files/`, formData({
    module,
    target_srl: srl,
    file,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.success) throw new Error(res.message);
  return filteringItemPost(res.data);
}
export async function removeFilesPost(src: any): Promise<(number|string)[]>
{
  if (src.length <= 0) throw new Error('no item');
  let res = await Promise.all(src.map((item: any) => {
    return post(`/files/${item.srl}/delete/`);
  }));
  return res.map((res, key: number) => {
    return res.success ? src[key].key : res.message;
  });
}
