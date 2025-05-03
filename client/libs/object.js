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
