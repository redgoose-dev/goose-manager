import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import * as toast from './modules/toast'
import { initCustomEvent } from './libs/util'
import registerServiceWorker from './registerServiceWorker'
import App from './app.vue'

// set stylesheet
import './assets/scss/main.scss'

// setup pinia
const pinia = createPinia()

// set modules
toast.setup()

// set custom events
initCustomEvent()

// set component
const app = createApp(App, {})
  .use(router)
  .use(pinia)
  .mount('#app')

// setup service worker
registerServiceWorker().then()

export default app
