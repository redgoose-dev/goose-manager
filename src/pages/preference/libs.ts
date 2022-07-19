import { message } from '../../message';

export function validateForms(src: any): void
{
  try
  {
    JSON.parse(src)
  }
  catch (e)
  {
    throw new Error(message.error.parsingJSON)
  }
}

export function getStringJson(src: any): any
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
