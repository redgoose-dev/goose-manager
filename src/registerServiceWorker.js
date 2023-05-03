let register

export default async function registerServiceWorker()
{
  if (!('serviceWorker' in navigator)) return
  register = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  })
  if (!register) throw new Error('no ServiceWorkerRegistration')

  // change state event
  const installingWorker = register.installing
  register.onupdatefound = onUpdateFound
  if (installingWorker)
  {
    installingWorker.onstatechange = onUpdateFound
  }
  // register.unregister().then()
}

function onUpdateFound(_e)
{
  // console.warn('STATE', '===>', _e.target.state)
}
