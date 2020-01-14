export const defaultParamsArticle = {
  field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
  ext_field: 'category_name',
  visible_type: 'all',
};

export const defaultParamsCategory = {
  ext_field: 'count_article,item_all,none',
  order: 'turn',
  sort: 'asc',
};

/**
 * set order
 *
 * @param {string} order
 * @param {string} sort
 * @return {string}
 */
export function setOrder(order='srl', sort='desc')
{
  switch (order)
  {
    case 'order':
      return `\`order\` ${sort}, \`srl\` ${sort}`;
    case 'srl':
    default:
      return `\`srl\` ${sort}`;
  }
}
