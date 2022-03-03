import * as storage from '../libs/storage';
import defaults from './defaults';
import store from '../store';
import { pureObject } from '../libs/object';

/**
 * get preference
 * @return {object}
 */
export function getPreference()
{
  const storagePreference = storage.get('preference');
  return storagePreference ? storagePreference : defaults;
}

/**
 * save preference
 */
export function savePreference()
{
  storage.set('preference', pureObject(store.state.preference));
}
