export const defaultParamsArticle = {
  field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
  visible_type: 'all',
  ext_field: 'category_name',
};

export const defaultParamsCategory = {
  order: 'turn',
  sort: 'asc',
  ext_field: 'count_article,item_all,none',
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
