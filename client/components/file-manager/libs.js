import { request } from '../../libs/api.js'
import { contentCodes } from '../../libs/assets.js'
import { insertMode } from './assets.js'

/**
 * convert data to file item
 * 외부에서 가져온 데이터를 파일 아이템으로 변환한다.
 * @param {object} src
 * @return {object}
 */
export function convertDataToFileItem(src)
{
  if (!src) return null
  let result = {}
  result.srl = src.srl
  result.code = src.code
  result.mime = src.mime
  result.module = src.module
  result.moduleSrl = src.module_srl
  result.size = src.size
  result.name = src.name
  if (src.json?.width || src.json?.height)
  {
    result.width = Number(src.json.width)
    result.height = Number(src.json.height)
  }
  return result
}

/**
 * get file
 * @param {number} srl
 * @param {'url'|'blob'} type
 * @return {Promise<Blob|string>}
 */
export async function getFile(srl, type = 'blob')
{
  const res = await request(`/file/${srl}/`)
  if (!res) throw new Error('파일을 가져오지 못했습니다.')
  if (!(res instanceof Blob)) throw new Error('파일 데이터가 아닙니다.')
  switch (type)
  {
    case 'url':
      return URL.createObjectURL(res)
    default:
      return res
  }
}

/**
 * convert output code
 * @param {object[]} arr
 * @param {string} mode
 * @param {string} keyName
 * @return {string}
 */
export function convertOutputCode(arr, mode, keyName = 'srl')
{
  switch (mode)
  {
    case insertMode.MARKDOWN:
      return arr.map(item => {
        if (/^image\//.test(item.mime))
        {
          return `![${item.name}](${contentCodes.API_HOST}/file/${item[keyName]}/)`
        }
        else
        {
          return `[${item.name}](${contentCodes.API_HOST}/file/${item[keyName]}/)`
        }
      }).join('\n')
    case insertMode.ADDRESS:
      return arr.map(item => {
        return `${contentCodes.API_HOST}/file/${item[keyName]}/`
      }).join('\n')
    case insertMode.HTML:
      return arr.map(item => {
        if (/^image\//.test(item.mime))
        {
          return `<p><img src="${contentCodes.API_HOST}/file/${item[keyName]}/" loading="lazy" alt="${item.name}"/></p>`
        }
        else
        {
          return `<p><a href="${contentCodes.API_HOST}/file/${item[keyName]}/" target="_blank">${item.name}</a></p>`
        }
      }).join(`\n`)
    default:
      return ''
  }
}
