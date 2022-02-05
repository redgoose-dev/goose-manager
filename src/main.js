import { createApp } from 'vue';
import router from './router';
import App from './app.vue';

// set stylesheet
import './assets/scss/main.scss';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */
/** @var {boolean} DEBUG */

// set global values
window.DEBUG = !!DEBUG;

// set index.html
document.title = TITLE;
document.querySelector('meta[name=description]').setAttribute('content', DESCRIPTION);

// set component
const app = createApp(App, {})
  .use(router)
  .mount('#app');

export default app;
