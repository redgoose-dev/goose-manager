/**
 * convert pure object
 * `proxy`, `observable`객체를 순수한 객체로 변환해준다.
 */
export function pureObject(src)
{
  if (!src) return null
  try
  {
    return JSON.parse(JSON.stringify(src))
  }
  catch(_)
  {
    return null
  }
}
