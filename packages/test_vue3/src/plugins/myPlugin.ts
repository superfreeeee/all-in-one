import type { App } from 'vue';
import { logGroup } from '@/utils/log';

export const myPlugin = {
  install(app: App<Element>, options: any) {
    logGroup(
      '[myPlugin] install',
      () => {
        console.log('app', app);
        console.log('options', options);
      },
      false,
    );
    // 全局注册，使用 app 的 api 进行扩展
    // app.component
    // app.directive
    // app.provide
    // app.mixin
  },
};
