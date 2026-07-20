import { ref, toRefs, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEY } from '@/libs/assets.js'
import { pureObject, deepUpdate } from '@/libs/object.js'
import { localRequest } from '@/libs/api.js'
import * as storage from '@/libs/storage.js'

function toPureObject(data, keys)
{
  let result = {}
  for (const key of keys)
  {
    result[key] = data[key]
  }
  return pureObject(result)
}

/**
 * Current Store
 */
export const currentStore = defineStore('current', () => {
  const defaultCurrentState = {
    blink: false,
    'article.thumbnail.ratio': null,
    'article.thumbnail.size': 0,
  }
  function getCurrentState()
  {
    const stored = storage.get(STORAGE_KEY)
    if (!stored || typeof stored !== 'object' || Array.isArray(stored))
    {
      return {
        ...defaultCurrentState,
      }
    }
    return {
      ...defaultCurrentState,
      ...stored,
    }
  }
  const state = reactive(getCurrentState())
  watch(state, value => {
    let _value = { ...value }
    delete _value.blink
    storage.set(STORAGE_KEY, pureObject(_value))
  }, {
    deep: true,
  })
  return toRefs(state)
})

/**
 * Preference Store
 */
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

/**
 * Date Store
 */
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
  function parseUTC(value)
  {
    if (value instanceof Date) return new Date(value)
    let src = String(value)
    if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(src)) src = `${src.replace(' ', 'T')}Z`
    const result = new Date(src)
    return isNaN(result.getTime()) ? null : result
  }
  function getDateTimeParts(value)
  {
    const _date = parseUTC(value)
    if (!_date) return null
    const parts = getFormatter({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      hourCycle: 'h23',
    }).formatToParts(_date)
    const result = {}
    for (const part of parts)
    {
      if (part.type !== 'literal') result[part.type] = Number(part.value)
    }
    return result
  }
  function getTimezoneOffset(value)
  {
    const parts = getDateTimeParts(value)
    if (!parts) return null
    return Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    ) - new Date(value).getTime()
  }
  function toUTCFromLocal(value)
  {
    const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)
    if (!match) return null
    const [ , year, month, day, hour = '0', minute = '0', second = '0' ] = match
    const localTimestamp = Date.UTC(
      Number(year), Number(month) - 1, Number(day),
      Number(hour), Number(minute), Number(second),
    )
    let utcTimestamp = localTimestamp
    for (let i = 0; i < 3; i++)
    {
      const offset = getTimezoneOffset(new Date(utcTimestamp))
      if (offset === null) return null
      utcTimestamp = localTimestamp - offset
    }
    return new Date(utcTimestamp)
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
      _date = parseUTC(value)
    }
    return _date ? getFormatter(dateFormatPreset[mode]).format(_date) : null
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
    let _date
    if (value instanceof Date)
    {
      _date = new Date(value)
    }
    else if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(String(value).trim()))
    {
      _date = new Date(value)
    }
    else
    {
      _date = toUTCFromLocal(value)
    }
    if (!_date || isNaN(_date.getTime())) return null
    return _date.toISOString()
  }
  return { locale, timezone, format, toUTC, clear }
})
