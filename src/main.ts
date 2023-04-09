import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import * as toast from './modules/toast'
import { initCustomEvent } from './libs/util'
import App from './app.vue'

// set stylesheet
import './assets/scss/main.scss'

// set global values
window.DEBUG = DEBUG
window.DEVELOPMENT = DEVELOPMENT

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

export default app
