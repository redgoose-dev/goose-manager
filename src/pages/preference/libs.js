import { message } from '../../message';

/**
 * validate forms
 * @param {any} src
 * @throw {Error}
 */
export function validateForms(src)
{
  try
  {
    JSON.parse(src);
  }
  catch (e)
  {
    throw new Error(message.error.parsingJSON);
  }
}

/**
 * get string json
 * @param {object|any[]} src
 * @return {any}
 */
export function getStringJson(src)
{
  try
  {
    return JSON.stringify(src, null, 2);
  }
  catch (e)
  {
    return '{}';
  }
}
