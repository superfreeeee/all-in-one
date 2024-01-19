import type { App } from 'vue';

export const myPlugin = {
  install(app: App<Element>, options: any) {
    console.log('[myPlugin] install', app, options);
    // 全局注册
    // app.component
    // app.directive
    // app.provide
    // app.mixin
  },
};
