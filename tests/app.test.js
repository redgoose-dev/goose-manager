import { describe, expect, it, beforeAll } from 'bun:test'
import * as api from './helper/api.js'
import * as timer from './helper/timer.js'

describe('Create App', () => {

  // beforeAll(async () => {})

  it.skip('앱을 여러개 만든다.', async () => {
    const count = 5
    for (let i = 0; i < count; i++)
    {
      await api.request('/app/', {
        method: 'put',
        body: {
          code: `clone #4-${i + 1}`,
          name: `CLONE APP #4-${i + 1}`,
          // description: '많이 클론된 ',
        },
      })
      await timer.sleep(50)
    }
  })

  it.skip('앱을 모두 삭제한다.', async () => {
    const apps = await api.request('/app/', {
      query: { page: 0, field: 'srl' },
    })
    for (const item of apps.data.index)
    {
      await api.request(`/app/${item.srl}/`, {
        method: 'delete',
      })
      await timer.sleep(50)
    }
  })

})
