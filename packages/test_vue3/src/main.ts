import './main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { myPlugin } from './plugins/MyPlugin';

const app = createApp(App);

app.use(myPlugin, {
  data: 'test-id',
});

app.mount('#app');
