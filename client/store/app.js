import { defineStore } from 'pinia'
import { pureObject, deepUpdate } from '../libs/object.js'
import { localRequest } from '../libs/api.js'

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

function toPureObject(data, keys)
{
  let result = {}
  for (const key of keys)
  {
    result[key] = data[key]
  }
  return pureObject(result)
}
