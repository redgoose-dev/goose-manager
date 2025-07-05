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

/**
 * checking json
 * @param {string|object} json
 * @throws {Error}
 */
export function checkingJSON(json)
{
  if (!json) throw new Error('no json data')
  if (typeof json !== 'string')
  {
    json = JSON.stringify(json)
  }
  JSON.parse(json)
}

/**
 * deep update object
 * @param {object} obj
 * @param {string} path
 * @param {any} value
 * @returns {object}
 */
export function deepUpdate(obj, path, value)
{
  const keys = path.split(/\.|\[|\]/).filter(key => key !== '')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++)
  {
    const key = keys[i]
    if (!current[key]) current[key] = isNaN(keys[i + 1]) ? {} : []
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
  return obj
}
