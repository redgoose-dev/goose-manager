import * as storage from '../libs/storage';
import defaults from './defaults';
import store from '../store';
import { pureObject } from '../libs/object';
import { selectLanguage } from '../message';

/**
 * get preference
 * @return {object}
 */
export function getPreference()
{
  let pref = storage.get('preference');
  pref = pref || defaults;
  selectLanguage(pref.lang);
  return pref;
}

/**
 * save preference
 */
export function savePreference()
{
  selectLanguage(store.state.preference.lang);
  storage.set('preference', pureObject(store.state.preference));
}
