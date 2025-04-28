export function validateForms(src)
{
  try
  {
    JSON.parse(src)
  }
  catch (e)
  {
    throw new Error('JSON 파싱하는데 오류가 발생했습니다.')
  }
}

export function getStringJson(src)
{
  try
  {
    return JSON.stringify(src, null, 2)
  }
  catch (e)
  {
    return '{}'
  }
}
