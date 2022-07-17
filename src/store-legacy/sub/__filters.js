import store from '../../store-legacy';
import * as storage from '../../libs/storage';
import { pureObject } from '../../libs/object';

const defaults = {
  articles: {
    type: 'all',
    order: 'srl',
    sort: 'desc',
    theme: 'card',
    keyword: '',
  },
  checklist: {
    dateStart: '',
    dateEnd: '',
    sort: 'desc',
    keyword: '',
  },
};

/**
 * get filters
 * @return {{ articles, checklist }}
 */
export function getFilters()
{
  let filters = storage.get('filters');
  return filters || defaults;
}

/**
 * save filters
 */
export function saveFilters()
{
  storage.set('filters', pureObject(store.state.filters));
}
