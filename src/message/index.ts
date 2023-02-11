import ko from './ko'

interface Structure {
  error: any
  confirm: any
  success: any
  fail: any
  word: any
  words: any
  header: any
  monthNames: string[]
  weekNames: string[]
  weekShortNames: string[]
}

const fallback: Structure = ko
export let message: Structure = ko

export function $msg(key: string): string
{
  function find(keys: string, src?: any): any
  {
    return keys.split('.').reduce((acc: any, cur: string) => {
      if (!(acc && acc[cur])) return
      return acc[cur]
    }, src)
  }
  let msg = find(key, message)
  if (!msg) msg = find(key, fallback)
  return msg
}

export async function changeLanguage(lang: string): Promise<void>
{
  switch (lang)
  {
    case 'ko':
    default:
      message = (await import('./ko')).default
      break
    case 'en':
      message = (await import('./en')).default
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
