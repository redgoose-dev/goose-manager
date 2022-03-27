import ko from './ko';
import en from './en';

// fallback language
const fallback = ko;

// message
export let message = ko;

/**
 * get message
 * @param {string} key
 * @return {string}
 */
export function $msg(key)
{
  function find(keys, src)
  {
    return keys.split('.').reduce((acc, cur, idx) => {
      if (!(acc && acc[cur])) return;
      return acc[cur];
    }, src);
  }
  let msg = find(key, message);
  if (!msg) msg = find(key, fallback);
  return msg;
}

/**
 * select language
 */
export function selectLanguage(lang)
{
  switch (lang)
  {
    case 'ko':
    default:
      message = ko;
      break;
    case 'en':
      message = en;
      break;
  }
}



// vue plugin
export const messagesPlugin = {
  /**
   * install
   */
  install(app, options)
  {
    app.config.globalProperties.$msg = key => $msg(key);
  },
};
