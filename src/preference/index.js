import * as storage from '../libs/storage';
import defaults from './defaults';
import store from '../store';
import { pureObject } from '../libs/object';

/**
 * get preference
 * @return {object}
 * */
export function getPreference()
{
  const storagePreference = storage.get('preference');
  return storagePreference ? JSON.parse(storagePreference) : defaults;
}

/**
 * save preference
 */
export function savePreference()
{
  const pref = pureObject(store.state.preference);
  storage.set('preference', JSON.stringify(pref, null, ''));
}
