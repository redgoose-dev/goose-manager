import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import setupModules from './modules/setup.js'
import toast from './modules/toast/index.js'
import App from './app.vue'

// load main stylesheet
import './scss/main.scss'

// setup pinia
const pinia = createPinia()

// setup modules
setupModules()

const app = createApp(App, {})
  .use(router)
  .use(pinia)
  .use(toast, {
    id: 'app-toast',
    max: 5,
  })
  .mount('#app')

export default app
