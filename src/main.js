import { createApp } from 'vue';
import router from './router';
import store from './store';
import * as toast from './modules/toast';
import { initCustomEvent } from './libs/util';
import { messagesPlugin } from './message';
import App from './app.vue';

// set stylesheet
import './assets/scss/main.scss';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */
/** @var {boolean} DEBUG */
/** @var {boolean} DEVELOPMENT */

// set global values
window.DEBUG = !!DEBUG;
window.DEVELOPMENT = !!DEVELOPMENT;

// set index.html
document.title = TITLE;
document.querySelector('meta[name=description]').setAttribute('content', DESCRIPTION);

// set modules
toast.setup();

// set custom events
initCustomEvent();

// set component
const app = createApp(App, {})
  .use(router)
  .use(store)
  .use(messagesPlugin)
  .mount('#app');

export default app;
