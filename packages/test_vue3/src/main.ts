import './main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { myPlugin } from './plugins/myPlugin';

const app = createApp(App);

/**
 * 自定义插件
 */
app.use(myPlugin, { data: 'test-id' });

app.mount('#app');
