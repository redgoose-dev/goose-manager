import ko from './ko'
import en from './en'
import type { Structure } from './index.d'

const fallback: Structure = ko
export let message: Structure = ko

export function $msg(key: string): string
{
  function find(keys: string, src?: any): any
  {
    return keys.split('.').reduce((acc: any, cur: string) => {
      if (!(acc && acc[cur])) return
      return acc[cur]
    }, src);
  }
  let msg = find(key, message)
  if (!msg) msg = find(key, fallback)
  return msg
}

export function changeLanguage(lang: string): void
{
  switch (lang)
  {
    case 'ko':
    default:
      message = ko
      break
    case 'en':
      message = en
      break
  }
}

// vue plugin
export const messagesPlugin = {
  install(app: any, _options?: any)
  {
    app.config.globalProperties.$msg = (k: any) => $msg(k)
  },
}
