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
