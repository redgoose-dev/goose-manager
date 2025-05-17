/**
 * pure object
 * @param obj
 * @returns {unknown}
 */
export function pureObject(obj)
{
  try
  {
    return structuredClone(obj)
  }
  catch (e)
  {
    return JSON.parse(JSON.stringify(obj))
  }
}

/**
 * 쿼리 스트링 값 준비를 위하여 값을 정리한다.
 * @param {object} query
 * @return {object}
 */
export function filterObjectToQuery(query)
{
  if (!query) return {}
  Object.entries(query).forEach(([ key, value ]) => {
    if (value === undefined)
    {
      delete query[key]
      return
    }
    query[key] = String(value)
  })
  return query
}
