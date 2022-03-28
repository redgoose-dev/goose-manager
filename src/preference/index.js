import * as storage from '../libs/storage';
import defaults from './defaults';
import store from '../store';
import { pureObject } from '../libs/object';
import { changeLanguage } from '../message';

/**
 * get preference
 * @return {object}
 */
export function getPreference()
{
  let pref = storage.get('preference');
  pref = pref || defaults;
  changeLanguage(pref.general.lang);
  return pref;
}

/**
 * save preference
 */
export function savePreference()
{
  changeLanguage(store.state.preference.general.lang);
  storage.set('preference', pureObject(store.state.preference));
}
