/**
 * get date
 * convert `yyyy-mm-dd hh:mm:ss` to `yyyy-mm-dd`
 */
export function getDate(date)
{
  return date.split(' ')[0]
}
