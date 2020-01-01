/**
 * with params form get datas
 *
 * @param {object} baseParams
 * @param {object} contents
 * @return {object}
 */
export function withParamsForGetDatas(baseParams, contents)
{
  let result = {};
  Object.keys(contents).filter((o) => contents[o].show).forEach((key) => {
    result[key] = {
      ...(baseParams[key] ? baseParams[key] : null),
      ...(contents[key].count ? { size: contents[key].count } : null),
    };
  });
  return result;
}
