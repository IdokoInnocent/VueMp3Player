import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// eslint-disable-next-line import/extensions
import VeeValidatePlugin from './includes/validation.js';
// import './includes/firebase'; //This was the code before
// Initializing firebase first
import { auth } from './includes/firebase'; // We want to initialize firebase first
import './assets/tailwind.css';
import './assets/main.css';
import Icon from './directives/icon';
import './registerServiceWorker';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router); // we did this because we don't have access to the router object in the progress-bar.js file

// We want to initilze firebase first so we did it this way.
let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.directive('icon', Icon);
    app.mount('#app');
  }
});

// The code below was the normal way.
// const app = createApp(App);
// app.use(store);
// app.use(router);
// app.use(VeeValidatePlugin);
// app.mount('#app');
