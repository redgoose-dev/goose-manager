import App from './app.svelte';
import './assets/scss/main.scss';

/** @var {boolean} DEBUG */

// set debug
window.DEBUG = !!DEBUG;

const app = new App({
  target: document.getElementById('app'),
  hydrate: true,
});

export default app;
