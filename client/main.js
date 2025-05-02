import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './app.vue'

// load main stylesheet
import './scss/main.scss'

// setup pinia
const pinia = createPinia()

const app = createApp(App, {})
  .use(router)
  .use(pinia)
  .mount('#app')

export default app
