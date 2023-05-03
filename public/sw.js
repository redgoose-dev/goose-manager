const CACHE_NAME = 'dev-app-v13'
const CACHE_RESOURCE = [
  'http://localhost:4400/favicon.ico',
  '/images/icons-512x512.webp',
  '/images/icons-512x512-mask.png',
]

// END OF RESOURCE //

// install
self.addEventListener('install', event => {
  async function setCacheResource()
  {
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(CACHE_RESOURCE)
  }
  event.waitUntil(setCacheResource())
  // 강제로 activate 이벤트를 트리깅한다.
  self.skipWaiting().then()
})

// activate
self.addEventListener('activate', event => {
  async function clearOldCache()
  {
    const keys = await caches.keys()
    await Promise.all(keys.map(name => {
      if (name !== CACHE_NAME) return caches.delete(name)
    }))
  }
  event.waitUntil(clearOldCache())
})

// fetch
self.addEventListener('fetch', event => {
  async function returnCachedResource(event)
  {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(event.request.url)
    if (cachedResponse)
    {
      return cachedResponse
    }
    else
    {
      const fetchResponse = await fetch(event.request)
      // `cache.put` 메서드는 전송하는 파일을 캐시에다 추가한다.
      // 캐시 목록에는 없지만 특정 조건으로 이후에 캐시목록에다 응답을 추가할 수 있다.
      // await cache.put(event.request.url, fetchResponse.clone())
      return fetchResponse
    }
  }
  switch (event.request.mode)
  {
    case 'navigate':
      // console.log('SW =>', '페이지이동모드')
      break
    default:
      event.respondWith(returnCachedResource(event))
      break
  }
})
