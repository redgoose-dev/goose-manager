import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { pureObject, deepUpdate } from '../libs/object.js'
import { localRequest } from '../libs/api.js'

function toPureObject(data, keys)
{
  let result = {}
  for (const key of keys)
  {
    result[key] = data[key]
  }
  return pureObject(result)
}

export const currentStore = defineStore('current', {
  state: () => ({
    blink: false,
  }),
})

const preferenceKeys = [ 'general', 'dashboard', 'nest', 'article', 'file', 'checklist', 'navigation' ]
export const preferenceStore = defineStore('preference', {
  state: () => {
    let result = {}
    for (const key of preferenceKeys) result[key] = undefined
    return result
  },
  getters: {
    _pure: (data) => toPureObject(data, preferenceKeys),
    _timezone: (data) => (data.general.timezone || 'UTC'),
    _locale: (data) => (data.general.locale || 'ko-KR'),
  },
  actions: {
    setup(pref)
    {
      const arr = Object.entries(pref)
      for (const [ key, value ] of arr)
      {
        if (!value) continue
        this[key] = value
      }
    },
    async update(path = null, value = null)
    {
      if (path)
      {
        deepUpdate(this, path, value || null)
      }
      const newValue = toPureObject(this, preferenceKeys)
      await localRequest({
        method: 'patch',
        url: '/zone/preference/',
        body: JSON.stringify(newValue),
      })
      // update date store
      const date = dateStore()
      date.locale = this._locale
      date.timezone = this._timezone
    },
    destroy()
    {
      for (const key of preferenceKeys)
      {
        this[key] = undefined
      }
    },
    async getDefault(keyName)
    {
      const res = await localRequest({
        method: 'post',
        url: '/zone/preference/',
        body: JSON.stringify({ default: true }),
      })
      return res?.data[keyName] || null
    }
  },
})

const dateFormatPreset = {
  // 0000. 00. 00.
  date: { year: 'numeric', month: '2-digit', day: '2-digit' },
  // 0000-00-00
  'date-dash': { locale: 'fr-CA', year: 'numeric', month: '2-digit', day: '2-digit' },
  // 00:00:00
  time: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
  // 0000-00-00 00:00:00
  'date-time': {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  },
  // 0000년 0월 0일 0시 0분 0초
  full: { dateStyle: 'long', timeStyle: 'medium' },
  week: { weekday: 'long' },
}
export const dateStore = defineStore('dater', () => {
  let locale = ref(navigator.language)
  let timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
  // 외부에 노출되지 않는 Formatter 캐시
  const cache = new Map()
  // watch locale,timezone
  watch([ locale, timezone ], () => {
    cache.clear()
  })
  // formatter function
  function getFormatter(options = {})
  {
    const key = JSON.stringify({
      locale: locale.value,
      timeZone: timezone.value,
      ...options,
    })
    let formatter = cache.get(key)
    if (!formatter)
    {
      formatter = new Intl.DateTimeFormat(options.locale || locale.value, {
        timeZone: timezone.value,
        ...options,
      })
      cache.set(key, formatter)
    }
    return formatter
  }
  /**
   * format
   * @param {string|Date} value
   * @param {string} mode
   */
  function format(value, mode = 'date-time')
  {
    if (!value) return null
    let _date
    if (value instanceof Date)
    {
      _date = value
    }
    else
    {
      if (!String(value).endsWith('Z')) value = `${value.replace(' ', 'T')}Z`
      _date = new Date(value)
    }
    return getFormatter(dateFormatPreset[mode]).format(_date)
  }
  // clear cache function
  function clear()
  {
    cache.clear()
  }
  // to UTC
  function toUTC(value)
  {
    if (!value) return null
    let _date = (value instanceof Date) ? value : new Date(value)
    return _date.toISOString()
  }
  return { locale, timezone, format, toUTC, clear }
})
